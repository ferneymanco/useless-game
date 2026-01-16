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
