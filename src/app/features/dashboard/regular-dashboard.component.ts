import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { PlayerService } from '../../core/services/player.service';
import { XpProgressBarComponent } from './components/xp-progress-bar/xp-progress-bar.component';
import { MissionDispatcherComponent } from './components/mission-dispatcher/mission-dispatcher.component';
import { ActivityLogComponent } from './components/activity-log/activity-log.component';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-regular-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, XpProgressBarComponent, MissionDispatcherComponent, ActivityLogComponent, MatIcon],
  template: `
    <div class="dashboard-layout" *ngIf="player() as p; else noProfile">
      
      <main class="main-content">
        <app-xp-progress-bar></app-xp-progress-bar>
        
        <section class="aethelgard-card profile-card">
          <div class="header-row">
            <h2>OPERATIVE: {{ p.role | uppercase }}</h2>
            <span class="status-tag" [class.is-donor]="p.isDonor">
              {{ p.isDonor ? 'PREMIUM ACCESS' : 'LIMITED NODE' }}
            </span>
          </div>
          
          <p class="id-text">Terminal ID: <code>{{ p.labelId }}</code></p>
          
          <div *ngIf="!p.isDonor" class="donation-alert">
            <p>The network requires funds to keep node active.</p>
            <button class="btn-contribute" (click)="onDonate()">CONTRIBUTE $1</button>
          </div>
        </section>

        <app-mission-dispatcher></app-mission-dispatcher>
      </main>

      <aside class="sidebar">
        <nav class="nav-panel aethelgard-card">
          <h3>SYSTEM MODULES</h3>
          
          <div class="menu-items">
            <a routerLink="/missions" class="nav-item active">
              <mat-icon>terminal</mat-icon> 
              <span>Missions</span>
            </a>

            <div class="nav-item" [class.locked]="!canAccessDecryptor()">
              @if (canAccessDecryptor()) {
                <a routerLink="/decryptor">
                  <mat-icon>psychology</mat-icon> <span>Decryptor Core</span>
                </a>
              } @else {
                <div class="lock-indicator">
                  <mat-icon>lock</mat-icon> <span>LVL 2 REQ</span>
                </div>
              }
            </div>

            <div class="nav-item" [class.locked]="!canAccessLeaderboard()">
              @if (canAccessLeaderboard()) {
                <a routerLink="/leaderboard">
                  <mat-icon>leaderboard</mat-icon> <span>Leaderboard</span>
                </a>
              } @else {
                <div class="lock-indicator">
                  <mat-icon>lock</mat-icon> <span>LVL 3 REQ</span>
                </div>
              }
            </div>
          </div>
        </nav>

        <app-activity-log></app-activity-log>
      </aside>
    </div>

    <ng-template #noProfile>
      <div class="centered-container">
        <div class="aethelgard-card alert-card">
          <mat-icon class="big-icon">gpp_maybe</mat-icon>
          <p>SYSTEM: No credentials detected. Identity verification required.</p>
          <button class="btn-primary" routerLink="/test">START EVALUATION</button>
        </div>
      </div>
    </ng-template>
  `,
  styles: [`
    .dashboard-layout {
      display: grid;
      grid-template-columns: 1fr 320px;
      gap: 25px;
      padding: 25px;
      max-width: 1600px;
      margin: 0 auto;
    }

    .main-content { display: flex; flex-direction: column; gap: 25px; }
    
    .sidebar { display: flex; flex-direction: column; gap: 20px; position: sticky; top: 25px; height: fit-content; }

    /* Cards y Header */
    .header-row { display: flex; justify-content: space-between; align-items: flex-start; }
    .status-tag { font-size: 0.7rem; padding: 4px 8px; border: 1px solid #444; border-radius: 4px; }
    .status-tag.is-donor { color: var(--aethelgard-amber); border-color: var(--aethelgard-amber); }
    .id-text { color: #888; font-size: 0.9rem; }

    /* Navegación */
    .nav-panel h3 { font-size: 0.8rem; color: #666; letter-spacing: 2px; margin-bottom: 15px; }
    .menu-items { display: flex; flex-direction: column; gap: 8px; }
    
    .nav-item {
      display: flex;
      align-items: center;
      text-decoration: none;
      color: #ccc;
      padding: 12px;
      background: rgba(255,255,255,0.03);
      border-radius: 4px;
      transition: all 0.2s;
    }
    
    .nav-item a { display: flex; align-items: center; gap: 12px; text-decoration: none; color: inherit; width: 100%; }
    .nav-item:hover:not(.locked) { background: rgba(255,179,0,0.1); color: var(--aethelgard-amber); }
    
    .nav-item.locked {
      opacity: 0.4;
      border: 1px dashed #444;
      background: transparent;
    }

    .lock-indicator { display: flex; align-items: center; gap: 10px; color: #ff4444; font-size: 0.75rem; }

    /* Botones y Alertas */
    .donation-alert {
      margin-top: 15px;
      padding: 15px;
      border: 1px dashed var(--aethelgard-amber);
      text-align: center;
    }
    .btn-contribute {
      background: var(--aethelgard-amber);
      color: black;
      border: none;
      padding: 8px 16px;
      font-weight: bold;
      cursor: pointer;
      width: 100%;
    }

    .centered-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 80vh;
    }

    @media (max-width: 1100px) {
      .dashboard-layout { grid-template-columns: 1fr; }
    }
  `]
})
export class RegularDashboardComponent {
  playerService = inject(PlayerService);
  router = inject(Router);

  // Signals
  player = this.playerService.player;
  
  // Computed
  canAccessDecryptor = computed(() => (this.player()?.accessLevel ?? 1) >= 2);
  canAccessLeaderboard = computed(() => (this.player()?.accessLevel ?? 1) >= 3);

  onDonate() {
    this.router.navigate(['/donate']);
  }
}