//functions/src/crafting.ts
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { checkEnergy, decrementItems, wasteEnergy } from './shared/economy';

// Importamos las recetas desde el modelo compartido
// Nota: Deberás copiar o compartir CRAFTING_RECIPES entre frontend y backend
const CRAFTING_RECIPES = [
  {
    id: 'craft_neural_link',
    resultItemId: 'neural_link',
    resultQuantity: 1,
    ingredients: [{ itemId: 'damaged_ram', quantity: 10 }],
    levelRequired: 3
  },
  {
    id: 'craft_bypass',
    resultItemId: 'security_bypass',
    resultQuantity: 1,
    ingredients: [{ itemId: 'signal_fragment', quantity: 5 }],
    levelRequired: 2
  }
];

export const craftItem = functions.https.onCall(async (data, context) => {
  const { recipeId } = data;
  const uid = context.auth?.uid;
  if (!uid) throw new functions.https.HttpsError('unauthenticated', 'Usuario no autenticado');

  const recipe = CRAFTING_RECIPES.find(r => r.id === recipeId);
  if (!recipe) throw new functions.https.HttpsError('not-found', 'Receta no válida');

  const userRef = admin.firestore().collection('players').doc(uid);
  const playerSnap = await userRef.get();
  const player = playerSnap.data();
  const cost = 5;

  
  const procced = await checkEnergy(player, cost);
  if (!procced) {
    throw new functions.https.HttpsError('failed-precondition', 'CORE_POWER_INSUFFICIENT');
  }

  return admin.firestore().runTransaction(async (transaction) => {
    // 1. Validar ingredientes
    for (const ing of recipe.ingredients) {
      const ingRef = userRef.collection('inventory').doc(ing.itemId);
      const snap = await transaction.get(ingRef);
      if (!snap.exists || (snap.data()?.quantity || 0) < ing.quantity) {
        throw new functions.https.HttpsError(
          'failed-precondition',
          `Material insuficiente: ${ing.itemId}`
        );
      }
    }
  
    // 2. Consumir ingredientes
    for (const ing of recipe.ingredients) {
      await decrementItems(transaction, userRef, ing.itemId, ing.quantity);
    }

    await wasteEnergy(transaction, userRef, cost);

    // 3. DETERMINAR ÉXITO O FALLO (5% de probabilidad de fallo)
    const isUnstable = Math.random() < 0.10; 
    let finalItemId = recipe.resultItemId;
    let status = 'SUCCESS';

    if (isUnstable) {
      finalItemId = 'unstable_scrap'; // El item fallido
      status = 'UNSTABLE_COLLAPSE';
    }

    //PENDING -> unlockedLore: admin.firestore.FieldValue.arrayUnion(recipe.resultItemId)

    return { success: true,status, craftedItem: finalItemId };
  });
});

export const addItem = functions.https.onCall(async (data, context) => {
  const uid = context.auth?.uid;
  if (!uid) throw new functions.https.HttpsError('unauthenticated', 'Usuario no autenticado');
  const userRef = admin.firestore().collection('players').doc(uid);
  const { itemId, quantity } = data;

  return admin.firestore().runTransaction(async (transaction) => {
    const resultRef = userRef.collection('inventory').doc(itemId);
      transaction.set(resultRef, {
        quantity: admin.firestore.FieldValue.increment(quantity)
      }, { merge: true });
  });
});
