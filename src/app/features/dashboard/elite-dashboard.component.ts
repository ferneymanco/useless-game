import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerService } from '../../core/services/player.service';

@Component({
  selector: 'app-elite-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="elite-container" *ngIf="playerService.player() as p; else noAccess">
      <div class="aethelgard-card elite-border">
        <h2 class="elite-text">ELITE SYSTEM OVERRIDE</h2>
        <p>RECRUIT TAG: {{ p.labelId }}</p>
        <p>CLEARANCE LEVEL: CLASS A (RESTRICTED)</p>
        
        <div class="terminal-mock">
          <p class="crypto-text">> Initializing secure uplink...</p>
          <p class="crypto-text">> Accessing encrypted nodes...</p>
          <p class="crypto-text">> Connection stable. System status: READY.</p>
        </div>

        <div class="special-actions">
          <button class="elite-btn">SCAN FOR DEEP NODES</button>
          <button class="elite-btn">BROADCAST SIGNAL SHIELD</button>
        </div>
      </div>
    </div>

    <ng-template #noAccess>
      <div class="aethelgard-card">
        <p class="error-text">ERROR: SECURE ACCESS DENIED.</p>
        <p>Unauthorized attempt detected. Return to civilian sectors.</p>
      </div>
    </ng-template>
  `,
  styles: [`
    .elite-container { padding: 20px; }
    .elite-border { border: 2px solid var(--aethelgard-green); }
    .elite-text { color: var(--aethelgard-green); text-shadow: 0 0 10px var(--aethelgard-green); }
    .terminal-mock {
      background: #000;
      padding: 15px;
      margin: 20px 0;
      font-family: 'Courier New', Courier, monospace;
      border: 1px solid #333;
    }
    .crypto-text { color: var(--aethelgard-green); margin: 5px 0; font-size: 0.9rem; }
    .special-actions { display: flex; gap: 10px; flex-wrap: wrap; }
    .elite-btn {
      background: transparent;
      border: 1px solid var(--aethelgard-green);
      color: var(--aethelgard-green);
      padding: 10px 20px;
      cursor: pointer;
      font-weight: bold;
      transition: all 0.3s;
    }
    .elite-btn:hover {
      background: var(--aethelgard-green);
      color: black;
    }
    .error-text { color: #ff4444; font-weight: bold; }
  `]
})
export class EliteDashboardComponent {
  playerService = inject(PlayerService);
}
