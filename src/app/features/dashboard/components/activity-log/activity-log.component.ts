import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogService } from '../../../../core/services/log.service';

@Component({
  selector: 'app-activity-log',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="terminal-box">
      <div class="terminal-header">SYSTEM_ACTIVITY_LOG</div>
      <div class="log-entries">
        <div *ngFor="let log of logs$ | async" class="log-line">
          <span class="timestamp">[{{ log.timestamp?.toDate() | date:'HH:mm:ss' }}]</span>
          <span class="type" [ngClass]="log.type">[{{ log.type }}]</span>
          <span class="msg">{{ log.message }}</span>
          <span class="xp" *ngIf="log.xpGained"> +{{ log.xpGained }}XP</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .terminal-box { 
      background: rgba(0, 10, 0, 0.9); 
      border: 1px solid #004400; 
      padding: 10px; 
      font-family: 'Courier New', monospace; 
      font-size: 12px; 
      height: 200px; 
      overflow-y: auto; 
    }
    .terminal-header { 
      color: #00ff00; 
      border-bottom: 1px solid #004400; 
      margin-bottom: 8px; 
      padding-bottom: 4px; 
      font-weight: bold; 
    }
    .log-line { 
      margin-bottom: 4px; 
      color: #00cc00; 
      animation: fadeIn 0.3s ease; 
    }
    .timestamp { 
      color: #006600; 
      margin-right: 8px; 
    }
    .type { 
      font-weight: bold; 
      margin-right: 8px; 
    }
    .type.LEVEL_UP { 
      color: #ffb000; 
    }
    .xp { 
      color: #ffb000; 
      font-weight: bold; 
    }
    @keyframes fadeIn { 
      from { opacity: 0; transform: translateX(-5px); } 
      to { opacity: 1; transform: translateX(0); } 
    }
    
    /* Custom scrollbar for terminal feel */
    .terminal-box::-webkit-scrollbar {
      width: 4px;
    }
    .terminal-box::-webkit-scrollbar-track {
      background: #000;
    }
    .terminal-box::-webkit-scrollbar-thumb {
      background: #004400;
    }
  `]
})
export class ActivityLogComponent {
  logs$ = inject(LogService).getRecentLogs();
}
