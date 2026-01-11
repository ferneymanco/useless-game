import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

/**
 * Procesa la finalización de una misión, otorga XP, 
 * verifica el subidón de nivel y registra la actividad.
 */
// functions/src/missions.ts

export const completeMission = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', '...');

  const { missionId, inputCode } = data;
  const userId = context.auth.uid;

  const userRef = admin.firestore().collection('players').doc(userId);
  const missionRef = admin.firestore().collection('missions').doc(missionId);

  const [userSnap, missionSnap] = await Promise.all([userRef.get(), missionRef.get()]);
  const userData = userSnap.data();
  const missionData = missionSnap.data();

  // --- CORRECCIÓN 1: VALIDACIÓN ROBUSTA ---
  const completed = userData?.completedMissions || [];
  if (completed.includes(missionId)) {
    return { success: false, message: 'PROTOCOL_ALREADY_SYNCED' };
  }

  if (missionData?.objectiveCode === inputCode) {
    const xpReward = Number(missionData?.xpReward);
    const currentXp = Number(userData?.experience || 0);
    const currentLevel = Number(userData?.accessLevel || 1);
    
    const newXp = currentXp + xpReward;
    
    // --- CORRECCIÓN 2: LÓGICA DE NIVEL ---
    // Si nivel 1 necesita 500, nivel 2 necesita 1000, etc.
    const xpThreshold = currentLevel * 500;
    let finalLevel = currentLevel;
    let leveledUp = false;

    if (newXp >= xpThreshold) {
      finalLevel = currentLevel + 1;
      leveledUp = true;
    }

    const batch = admin.firestore().batch();
    batch.update(userRef, {
      experience: newXp,
      accessLevel: finalLevel,
      completedMissions: admin.firestore.FieldValue.arrayUnion(missionId)
    });

    // (Aquí va el código de los logs que pusimos antes...)

    await batch.commit();
    return { success: true, newXp: xpReward, leveledUp, nextLevel: finalLevel };
  }
  return { success: false, message: 'INVALID_CODE' };
});