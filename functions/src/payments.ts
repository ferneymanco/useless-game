import * as functions from 'firebase-functions';
import Stripe from 'stripe';

const stripe = new Stripe(functions.config().stripe.secret, { apiVersion: '2023-10-16' as any });

export const createStripeCheckout = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Login required.');

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: { name: 'Aethelgard Recruit Access' },
        unit_amount: 100, // $1.00 in cents
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: 'https://your-app.com/dashboard?payment=success',
    cancel_url: 'https://your-app.com/donation?payment=failed',
    metadata: { userId: context.auth.uid } // Critical to link payment to user
  });

  return { url: session.url };
});
