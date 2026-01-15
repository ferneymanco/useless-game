import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

export const syncFieldNode = functions.https.onCall(async (data, context) => {
  // 1. Authentication Check
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be logged in.');
  }

  const { nodeId, discoveryCode } = data;
  const userId = context.auth.uid;

  // 2. Validate the Node in the Master Database
  // We assume there is a collection 'nodes' with secret codes
  const nodeRef = db.collection('nodes').doc(nodeId);
  const nodeDoc = await nodeRef.get();

  if (!nodeDoc.exists || nodeDoc.data()?.secretCode !== discoveryCode) {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid Node ID or Secret Code.');
  }

  const playerRef = db.collection('players').doc(userId);
  const playerDoc = await playerRef.get();

  if (!playerDoc.exists) {
    throw new functions.https.HttpsError('not-found', 'Player profile not found.');
  }

  const playerData = playerDoc.data() as any;

  // 3. Prevent Duplicate Rewards
  if (playerData.foundNodes?.includes(nodeId)) {
    return { success: false, message: 'Node already synchronized.' };
  }

  // 4. Atomic Update: Increase Experience and Add Node
  await playerRef.update({
    experience: admin.firestore.FieldValue.increment(50),
    foundNodes: admin.firestore.FieldValue.arrayUnion(nodeId)
  });

  return {
    success: true,
    message: 'Node synchronized. 50 XP added to your profile.',
    newLevel: Math.floor((playerData.experience + 50) / 100)
  };
});

export * from './missions';
export * from './crafting';
