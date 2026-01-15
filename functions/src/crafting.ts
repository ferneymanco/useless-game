//functions/src/crafting.ts
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

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
      const ingRef = userRef.collection('inventory').doc(ing.itemId);
      transaction.update(ingRef, { 
        quantity: admin.firestore.FieldValue.increment(-ing.quantity) 
      });
    }

    // 3. Entregar resultado
    const resultRef = userRef.collection('inventory').doc(recipe.resultItemId);
    transaction.set(resultRef, {
      quantity: admin.firestore.FieldValue.increment(recipe.resultQuantity)
    }, { merge: true });

    return { success: true, craftedItem: recipe.resultItemId };
  });
});
