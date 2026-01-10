// functions/src/payments.ts
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import axios from 'axios';

const PAYPAL_API = 'https://api-m.sandbox.paypal.com'; // Change to api-m.paypal.com for production

async function getPayPalAccessToken() {
  const auth = Buffer.from(
    `${functions.config().paypal.client_id}:${functions.config().paypal.secret}`
  ).toString('base64');

  const response = await axios.post(`${PAYPAL_API}/v1/oauth2/token`, 
    'grant_type=client_credentials', 
    { headers: { Authorization: `Basic ${auth}` } }
  );
  return response.data.access_token;
}

export const verifyPaypalPayment = functions.https.onCall(async (data, context) => {
  // 1. Auth Check
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be signed in.');
  }

  const { orderId } = data;
  const userId = context.auth.uid;

  try {
    // 2. Get PayPal Access Token
    const accessToken = await getPayPalAccessToken();

    // 3. Verify Order Details with PayPal
    const orderResponse = await axios.get(`${PAYPAL_API}/v2/checkout/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    const orderData = orderResponse.data;
    const amount = orderData.purchase_units[0].amount.value;
    const status = orderData.status;

    // 4. Validation Logic
    if (status === 'COMPLETED' && amount === '1.00') {
      // 5. Atomic Update in Firestore
      const userRef = admin.firestore().collection('players').doc(userId);
      await userRef.update({
        isDonor: true,
        accessLevel: 2,
        unlockedFeatures: admin.firestore.FieldValue.arrayUnion('mobile_handset_v1'),
        verifiedPaymentId: orderId
      });

      return { success: true, message: 'Contribution verified. Neural link upgraded.' };
    } else {
      throw new functions.https.HttpsError('invalid-argument', 'Invalid payment status or amount.');
    }
  } catch (error: any) {
    console.error('PayPal Verification Error:', error);
    throw new functions.https.HttpsError('internal', 'Verification failed.');
  }
});