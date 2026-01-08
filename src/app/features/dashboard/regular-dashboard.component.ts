import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { PlayerService } from '../../core/services/player.service';

@Component({
  selector: 'app-regular-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div *ngIf="playerService.player() as p; else noProfile">

      <div class="aethelgard-card">
        <h2>WELCOME, {{ p.role | uppercase }}</h2>
        <p>Your field ID is {{ p.labelId }}</p>
        
        <div *ngIf="!p.isDonor" class="donation-alert">
          <p>The network requires funds to keep node {{p.labelId}} active.</p>
          <button (click)="onDonate()">CONTRIBUTE $1 FOR THE CAUSE</button>
        </div>

        <div *ngIf="p.isDonor">
          <p>Access verified. You are a network donor.</p>
        </div>
      </div>
    </div>

    <ng-template #noProfile>
      <div class="aethelgard-card">
        <p>SYSTEM: No credentials detected. Please take the aptitude test.</p>
        <button routerLink="/test">START EVALUATION</button>
      </div>
    </ng-template>
  `,
  styles: [`
    .donation-alert {
      margin-top: 20px;
      padding: 15px;
      border: 1px dashed var(--aethelgard-amber);
      background: rgba(255, 179, 0, 0.05);
    }
    button {
      margin-top: 10px;
      padding: 10px 20px;
      background: var(--aethelgard-amber);
      color: black;
      border: none;
      cursor: pointer;
      font-weight: bold;
    }
  `]
})
export class RegularDashboardComponent {
  playerService = inject(PlayerService);
  router = inject(Router);

  onDonate() {
    this.router.navigate(['/donate']);
  }
}
