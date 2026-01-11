import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

/**
 * Procesa la finalización de una misión, otorga XP, 
 * verifica el subidón de nivel y registra la actividad.
 */
export const completeMission = functions.https.onCall(async (data, context) => {
  // 1. Verificación de Seguridad: Usuario autenticado
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated', 
      'Access denied. Neural link not established.'
    );
  }

  const { missionId, inputCode } = data;
  const userId = context.auth.uid;

  try {
    // Referencias a Firestore
    const userRef = admin.firestore().collection('players').doc(userId);
    const missionRef = admin.firestore().collection('missions').doc(missionId);

    // 2. Obtener datos necesarios en paralelo
    const [userSnap, missionSnap] = await Promise.all([
      userRef.get(),
      missionRef.get()
    ]);

    if (!missionSnap.exists) {
      throw new functions.https.HttpsError('not-found', 'Mission protocol not found.');
    }

    const userData = userSnap.data();
    const missionData = missionSnap.data();

    // 3. Validación: Evitar doble recompensa
    if (userData?.completedMissions?.includes(missionId)) {
      return { 
        success: false, 
        message: 'Protocol already synchronized in your neural core.' 
      };
    }

    // 4. Validación: Código de objetivo
    if (missionData?.objectiveCode !== inputCode) {
      return { 
        success: false, 
        message: 'Invalid decryption code. Access denied.' 
      };
    }

    // --- LOGICA DE RECOMPENSA ---
    const xpReward = missionData?.xpReward || 0;
    const currentXp = userData?.experience || 0;
    const currentLevel = userData?.accessLevel || 1;
    
    const newXp = currentXp + xpReward;
    
    // Fórmula de Level Up: (Nivel Actual * 500)
    const xpThreshold = currentLevel * 500;
    let finalLevel = currentLevel;
    let leveledUp = false;

    if (newXp >= xpThreshold) {
      finalLevel = currentLevel + 1;
      leveledUp = true;
    }

    // 5. Operaciones de Escritura (Actualización de Perfil + Logs)
    const batch = admin.firestore().batch();

    // Actualizar perfil del jugador
    batch.update(userRef, {
      experience: newXp,
      accessLevel: finalLevel,
      completedMissions: admin.firestore.FieldValue.arrayUnion(missionId)
    });

    // Crear log de misión completada
    const missionLogRef = userRef.collection('logs').doc();
    batch.set(missionLogRef, {
      type: 'MISSION_COMPLETE',
      message: `Protocol: ${missionData?.title} synchronized.`,
      xpGained: xpReward,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    // Crear log de Level Up si aplica
    if (leveledUp) {
      const levelLogRef = userRef.collection('logs').doc();
      batch.set(levelLogRef, {
        type: 'LEVEL_UP',
        message: `Neural link upgraded to LEVEL ${finalLevel}.`,
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      });
    }

    // Ejecutar todos los cambios atómicamente
    await batch.commit();

    return { 
      success: true, 
      newXp: xpReward,
      leveledUp: leveledUp,
      nextLevel: finalLevel 
    };

  } catch (error: any) {
    console.error('Mission processing error:', error);
    throw new functions.https.HttpsError('internal', 'Critical system failure during synchronization.');
  }
});