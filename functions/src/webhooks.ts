import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const stripeWebhook = functions.https.onRequest(async (request, response) => {
  // const sig = request.headers['stripe-signature'];
  // let event;

  try {
    // Verify that the event comes from Stripe
    // For a real implementation, you would use:
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    // event = stripe.webhooks.constructEvent(request.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET!);
    
    // Using simplified logic as provided:
    if (request.body.type === 'checkout.session.completed') {
      const session = request.body.data.object;
      const userId = session.metadata.userId;

      if (userId) {
        // Update Player Profile in Firestore
        await admin.firestore().collection('players').doc(userId).update({
          isDonor: true,
          accessLevel: 2,
          unlockedFeatures: admin.firestore.FieldValue.arrayUnion('mobile_app_download')
        });
        
        console.log(`User ${userId} upgraded to donor status.`);
      }
    }

    response.json({ received: true });
  } catch (err) {
    console.error(`Webhook Error: ${err}`);
    response.status(400).send(`Webhook Error: ${err}`);
  }
});
