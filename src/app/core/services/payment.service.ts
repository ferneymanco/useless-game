import { Injectable, inject } from '@angular/core';
import { Functions, httpsCallable } from '@angular/fire/functions';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private functions = inject(Functions);

  async startCheckoutSession() {
    const createSession = httpsCallable(this.functions, 'createStripeCheckout');
    try {
      const response: any = await createSession({ priceId: 'price_YOUR_STRIPE_ID' });
      // Stripe redirect URL
      window.location.href = response.data.url;
    } catch (error) {
      console.error('Payment session failed:', error);
    }
  }
}
