//functions/src/inventory.ts
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const dismantleItem = functions.https.onCall(async (data, context) => {
  const { itemId } = data;
  const uid = context.auth?.uid;
  if (!uid) throw new functions.https.HttpsError('unauthenticated', 'Usuario no autenticado');

  const userRef = admin.firestore().collection('players').doc(uid);
  const itemRef = userRef.collection('inventory').doc(itemId);

  return admin.firestore().runTransaction(async (transaction) => {
    const snap = await transaction.get(itemRef);
    if (!snap.exists || (snap.data()?.quantity || 0) <= 0) {
      throw new functions.https.HttpsError('not-found', 'No tienes este objeto.');
    }

    // 1. Quitar el objeto inestable
    transaction.update(itemRef, { quantity: admin.firestore.FieldValue.increment(-1) });

    // 2. Calcular materiales recuperados (50% aprox de una receta base)
    // En este caso, daremos 5 fragmentos o 5 módulos RAM al azar
    const materials = [
      { id: 'signal_fragment', qty: 3 },
      { id: 'damaged_ram', qty: 2 }
    ];

    for (const mat of materials) {
      const matRef = userRef.collection('inventory').doc(mat.id);
      transaction.set(matRef, {
        quantity: admin.firestore.FieldValue.increment(mat.qty)
      }, { merge: true });
    }

    return { success: true, recovered: materials };
  });
});


// functions/src/inventory.ts

export const useEnergyCell = functions.https.onCall(async (data, context) => {
  const uid = context.auth?.uid;
  if (!uid) throw new functions.https.HttpsError('unauthenticated', '...');

  const userRef = admin.firestore().collection('players').doc(uid);
  const itemRef = userRef.collection('inventory').doc('energy_cell');

  return admin.firestore().runTransaction(async (transaction) => {
    const playerSnap = await transaction.get(userRef);
    const itemSnap = await transaction.get(itemRef);

    // 1. Validaciones
    if (!itemSnap.exists || itemSnap.data()?.quantity <= 0) {
      throw new Error("No tienes Células de Energía.");
    }

    const playerData = playerSnap.data();
    const now = admin.firestore.Timestamp.now();

    // 2. Calcular energía actual con regeneración pasiva
    const elapsed = now.seconds - playerData?.lastEnergyUpdate?.seconds;
    const regenerated = Math.floor(elapsed / playerData?.regenRate);
    const currentEnergy = Math.min(playerData?.maxEnergy, playerData?.energy + regenerated);

    // 3. Aplicar el Bono (+10) sin pasar el máximo
    const energyBoost = 10;
    const finalEnergy = Math.min(playerData?.maxEnergy, currentEnergy + energyBoost);

    // 4. Actualizar base de datos
    transaction.update(userRef, {
      energy: finalEnergy,
      lastEnergyUpdate: now // Importante: Reseteamos para que la regen empiece de cero desde aquí
    });

    transaction.update(itemRef, {
      quantity: admin.firestore.FieldValue.increment(-1)
    });

    return { success: true, newEnergy: finalEnergy };
  });
});
