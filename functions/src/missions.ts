import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

/**
 * Procesa la finalización de una misión, otorga XP, 
 * verifica el subidón de nivel y registra la actividad.
 */
// functions/src/missions.ts

export const syncMissionProgress = functions.https.onCall(async (data, context) => {
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
    const xpThreshold = currentLevel * 500;
    
    let finalLevel = currentLevel;
    let leveledUp = false;

    if (newXp >= xpThreshold) {
      finalLevel = currentLevel + 1;
      leveledUp = true;
    }

    // LOG DE DEPURACIÓN (Míralo en Firebase Console > Functions > Logs)
    console.log(`Calculated for ${userId}: XP:${newXp}, LVL:${finalLevel}, UP:${leveledUp}`);

    const batch = admin.firestore().batch();
    
    batch.update(userRef, {
      experience: newXp,
      accessLevel: finalLevel,
      completedMissions: admin.firestore.FieldValue.arrayUnion(missionId)
    });

    // IMPORTANTE: Asegúrate de incluir los Logs de actividad aquí para que el batch sea útil
    const logRef = userRef.collection('logs').doc();
    batch.set(logRef, {
      type: 'MISSION_COMPLETE',
      message: `Protocol ${missionData?.title} synchronized.`,
      xpGained: xpReward,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    await batch.commit();

    // RETORNO EXPLÍCITO
    const finalResponse = { 
      success: true, 
      newXp: Number(xpReward), 
      leveledUp: Boolean(leveledUp), // Forzamos booleano
      nextLevel: Number(finalLevel),
      debugInfo: "v2-deployed"
    };
    console.log("Enviando respuesta:", finalResponse);
    
    return finalResponse;
  }
  return { success: false, message: 'INVALID_CODE' };
});

export const processDecryption = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', '...');

  const userId = context.auth.uid;
  const userRef = admin.firestore().collection('players').doc(userId);
  const userSnap = await userRef.get();
  const userData = userSnap.data();
  const lootChance = Math.random();
  let lootMessage = "";

  // --- LÓGICA DE TIEMPO (COOLDOWN) ---
  const now = Date.now();
  /* const lastDecryption = userData?.lastDecryption || 0;
  const twentyFourHours = 24 * 60 * 60 * 1000; */

  /* if (now - lastDecryption < twentyFourHours) {
    const remaining = Math.ceil((twentyFourHours - (now - lastDecryption)) / (1000 * 60 * 60));
    return { 
      success: false, 
      message: `SYSTEM_RECHARGING: ${remaining} hours remaining.` 
    };
  } */

  // --- RECOMPENSA ---
  const isPerfect = data.isPerfect || false;
  const baseReward = 50;
  console.log("IS PERFECT: ", isPerfect); 
  console.log("BASE REWARD: ", baseReward); 
  const finalReward = isPerfect ? baseReward * 2 : baseReward;
  const newXp = (userData?.experience || 0) + finalReward;
  console.log("NUEVO XP: ", newXp);

  await userRef.update({
    experience: newXp,
    lastDecryption: now,
    // Podrías añadir un contador de "nodos descifrados"
    decryptedNodes: admin.firestore.FieldValue.increment(1),
    perfectDecryptions: admin.firestore.FieldValue.increment(isPerfect ? 1 : 0)
  });

  if (lootChance > 0.8) { // 20% de probabilidad de encontrar algo
    const itemRef = userRef.collection('inventory').doc('signal_fragment');
    await itemRef.set({
      name: 'Fragmento de Señal',
      quantity: admin.firestore.FieldValue.increment(1),
      rarity: 'COMMON',
      icon: 'memory'
    }, { merge: true });
    lootMessage = "ITEM_ACQUIRED: SIGNAL_FRAGMENT";
    
  }
  return { success: true, newXp, message: lootMessage };
  /* return { 
    success: true, 
    newXp: newXp,
    message: 'SIGNAL_DECRYPTED_SUCCESSFULLY' 
  }; */
});

// functions/src/index.ts (No olvides exportarla)
export const getGlobalLeaderboard = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Acceso denegado.');

  const snapshot = await admin.firestore()
    .collection('players')
    .orderBy('accessLevel', 'desc')
    .orderBy('experience', 'desc')
    .limit(10)
    .get();

  const leaderboard = snapshot.docs.map(doc => {
    const d = doc.data();
    return {
      labelId: d.labelId,
      role: d.role,
      level: d.accessLevel,
      xp: d.experience,
      isDonor: d.isDonor || false,
      badge: d.currentBadge || 'OPERATIVE'
    };
  });

  return { success: true, leaderboard };
});

export const claimBadge = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', '...');

  const { badgeId } = data; // Ej: 'SPECTRE'
  const userId = context.auth.uid;
  const userRef = admin.firestore().collection('players').doc(userId);
  const userSnap = await userRef.get();
  const userData = userSnap.data();

  // Validación de nivel para el badge 'SPECTRE' (Nivel 3)
  if (badgeId === 'SPECTRE' && (userData?.accessLevel || 0) < 3) {
    throw new functions.https.HttpsError('failed-precondition', 'Nivel insuficiente.');
  }

  await userRef.update({ currentBadge: badgeId });
  return { success: true, badge: badgeId };
});

export const consumeItem = functions.https.onCall(async (data, context) => {
  const { itemId } = data;
  const userId = context.auth?.uid;
  if (!userId) throw new functions.https.HttpsError('unauthenticated', '...');

  const itemRef = admin.firestore().collection('players').doc(userId).collection('inventory').doc(itemId);
  const itemSnap = await itemRef.get();

  if (!itemSnap.exists || itemSnap.data()?.quantity <= 0) {
    throw new functions.https.HttpsError('not-found', 'Item agotado.');
  }

  // 1. Restar cantidad
  await itemRef.update({
    quantity: admin.firestore.FieldValue.increment(-1)
  });

  // 2. Lógica de efecto (Ejemplo: Revelar una pista secreta)
  let intel = "No se encontró información adicional.";
  if (itemId === 'signal_fragment') {
    intel = "LA CONTRASEÑA DEL NÚCLEO COMIENZA CON 'AETH_'.";
  }

  return { 
    success: true, 
    message: "Objeto procesado correctamente.",
    intel: intel 
  };
});