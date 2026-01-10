import { Component, OnInit, inject, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerService } from '../../core/services/player.service';
import { Router } from '@angular/router';
import { Functions, httpsCallable } from '@angular/fire/functions';

declare var paypal: any; // Declaración para el SDK global

@Component({
  selector: 'app-donation',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="donation-container">
      <div class="aethelgard-card">
        <h2>FUNDING PROTOCOL: PAYPAL GATEWAY</h2>
        <p>Contribution required: <strong>$1.00 USD</strong></p>
        <div #paypalButtonContainer></div> </div>
    </div>
  `,
  styles: [`
    .donation-container { display: flex; justify-content: center; padding: 40px; }
    .aethelgard-card { width: 100%; max-width: 400px; text-align: center; }
  `]
})
export class DonationComponent implements OnInit {
  @ViewChild('paypalButtonContainer', { static: true }) paypalButtonContainer!: ElementRef;
  
  private playerService = inject(PlayerService);
  private router = inject(Router);
  private functions = inject(Functions);

  ngOnInit() {
    this.initPayPal();
  }

  initPayPal() {
    paypal.Buttons({
      createOrder: (data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [{
            amount: { value: '1.00' },
            description: 'Aethelgard Recruit Access'
          }]
        });
      },
      onApprove: async (data: any, actions: any) => {
        // data.orderID es lo que PayPal nos entrega
        const verifyFunc = httpsCallable(this.functions, 'verifyPaypalPayment');
        
        try {
          const result: any = await verifyFunc({ orderId: data.orderID });
          if (result.data.success) {
            this.router.navigate(['/dashboard'], { queryParams: { welcome: 'recruit' } });
          }
        } catch (err) {
          console.error('Security Verification Failed', err);
        }
      },
      onError: (err: any) => {
        console.error('PayPal Error:', err);
      }
    }).render(this.paypalButtonContainer.nativeElement);
  }
}
