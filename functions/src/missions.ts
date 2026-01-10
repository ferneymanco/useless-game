import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const completeMission = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Log in required.');

  const { missionId, inputCode } = data;
  const userId = context.auth.uid;

  const missionDoc = await admin.firestore().collection('missions').doc(missionId).get();
  const mission = missionDoc.data();

  if (mission && mission.objectiveCode === inputCode) {
    const userRef = admin.firestore().collection('players').doc(userId);
    
    await userRef.update({
      experience: admin.firestore.FieldValue.increment(mission.xpReward),
      completedMissions: admin.firestore.FieldValue.arrayUnion(missionId)
    });

    return { success: true, newXp: mission.xpReward };
  } else {
    return { success: false, message: 'Invalid Objective Code.' };
  }
});
