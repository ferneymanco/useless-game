import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { PaymentService } from '../../core/services/payment.service';

@Component({
  selector: 'app-donation',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule],
  template: `
    <div class="donation-container">
      <mat-card class="aethelgard-card">
        <mat-card-header>
          <mat-card-title>FUNDING PROTOCOL: PHASE 01</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p class="description">
            To maintain the **Aethelgard Node Network**, we require a $1.00 contribution. 
            This will grant you full access to the Mobile Handset App and Field Operations.
          </p>
          <div class="price-tag">$1.00 USD</div>
        </mat-card-content>
        <mat-card-actions>
          <button mat-raised-button color="accent" (click)="initiateContribution()">
            INITIATE CONTRIBUTION
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .donation-container { display: flex; justify-content: center; padding: 40px; }
    .price-tag { font-size: 3rem; color: var(--aethelgard-amber); text-align: center; margin: 20px 0; }
    .description { line-height: 1.6; }
  `]
})
export class DonationComponent {
  private paymentService = inject(PaymentService);

  initiateContribution() {
    this.paymentService.startCheckoutSession();
  }
}
