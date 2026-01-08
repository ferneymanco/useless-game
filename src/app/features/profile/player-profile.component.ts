import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { PlayerService } from '../../core/services/player.service';

@Component({
  selector: 'app-player-profile',
  standalone: true,
  imports: [CommonModule, MatProgressBarModule, MatIconModule],
  template: `
    <div class="profile-grid" *ngIf="playerService.player() as p; else noProfile">
      <div class="header">
        <h1>RECRUIT_ID: {{p.labelId}}</h1>
        <span class="status-tag">STATUS: ACTIVE</span>
      </div>

      <div class="role-card aethelgard-card">
        <h3>SPECIALIZATION: {{p.role | uppercase}}</h3>
        <mat-icon>terminal</mat-icon>
        <p>Access Level: Class {{p.accessLevel === 1 ? 'C' : 'B'}}</p>
        <mat-progress-bar mode="determinate" [value]="p.experience % 100" class="custom-progress"></mat-progress-bar>
        <small>EXP: {{p.experience}} / {{ (floor(p.experience / 100) + 1) * 100 }}</small>
      </div>

      <div class="badges">
        <div class="badge" title="First Node">
          <mat-icon [style.color]="p.foundNodes.length > 0 ? 'var(--aethelgard-green)' : '#333'">verified</mat-icon>
        </div>
        <div class="badge" title="Donor">
          <mat-icon [style.color]="p.isDonor ? 'var(--aethelgard-green)' : '#333'">verified</mat-icon>
        </div>
        <div class="badge" title="Elite">
          <mat-icon [style.color]="p.isElite ? 'var(--aethelgard-green)' : '#333'">verified</mat-icon>
        </div>
      </div>
    </div>

    <ng-template #noProfile>
      <div class="aethelgard-card">
        <p>No profile data found. Please complete the aptitude test.</p>
      </div>
    </ng-template>
  `,
  styles: [`
    .profile-grid { display: grid; gap: 20px; padding: 20px; }
    .status-tag { color: var(--aethelgard-green); border: 1px solid; padding: 2px 8px; }
    .custom-progress { height: 10px; margin: 10px 0; }
  `]
})
export class PlayerProfileComponent {
  playerService = inject(PlayerService);
  
  floor(val: number) {
    return Math.floor(val);
  }
}
