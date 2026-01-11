import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { PlayerService } from '../../core/services/player.service';
import { XpProgressBarComponent } from './components/xp-progress-bar/xp-progress-bar.component';
import { MissionDispatcherComponent } from './components/mission-dispatcher/mission-dispatcher.component';
import { ActivityLogComponent } from './components/activity-log/activity-log.component';

@Component({
  selector: 'app-regular-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, XpProgressBarComponent, MissionDispatcherComponent, ActivityLogComponent],
  template: `
    <div class="dashboard-layout" *ngIf="playerService.player() as p; else noProfile">
      <div class="main-content">
        <app-xp-progress-bar></app-xp-progress-bar>
        
        <div class="aethelgard-card profile-card">
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

        <app-mission-dispatcher></app-mission-dispatcher>
      </div>

      <aside class="sidebar">
        <app-activity-log></app-activity-log>
      </aside>
    </div>

    <ng-template #noProfile>
      <div class="aethelgard-card">
        <p>SYSTEM: No credentials detected. Please take the aptitude test.</p>
        <button routerLink="/test">START EVALUATION</button>
      </div>
    </ng-template>
  `,
  styles: [`
    .dashboard-layout {
      display: grid;
      grid-template-columns: 1fr 320px;
      gap: 20px;
      padding: 20px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .main-content {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .sidebar {
      position: sticky;
      top: 20px;
      height: fit-content;
    }

    .profile-card {
      margin-bottom: 0;
    }

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

    @media (max-width: 950px) {
      .dashboard-layout {
        grid-template-columns: 1fr;
      }
      .sidebar {
        position: static;
      }
    }
  `]
})
export class RegularDashboardComponent {
  playerService = inject(PlayerService);
  router = inject(Router);
  player = this.playerService.player;
  role = computed(() => this.player()?.role || 'recruit');
  level = computed(() => this.player()?.accessLevel || 0);
  xp = computed(() => this.player()?.experience || 0);

  onDonate() {
    this.router.navigate(['/donate']);
  }
}
