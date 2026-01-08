import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-player-profile',
  standalone: true,
  imports: [CommonModule, MatProgressBarModule, MatIconModule],
  template: `
    <div class="profile-grid">
      <div class="header">
        <h1>ID_RECLUTA: #{{playerID}}</h1>
        <span class="status-tag">ESTADO: ACTIVO</span>
      </div>

      <div class="role-card aethelgard-card">
        <h3>ESPECIALIZACIÓN: {{role | uppercase}}</h3>
        <mat-icon>terminal</mat-icon>
        <p>Nivel de Acceso: Clase C</p>
        <mat-progress-bar mode="determinate" [value]="experience" class="custom-progress"></mat-progress-bar>
        <small>EXP: {{experience}} / 100</small>
      </div>

      <div class="badges">
        <div class="badge" *ngFor="let b of badges" [title]="b.name">
          <mat-icon [style.color]="b.earned ? 'var(--aethelgard-green)' : '#333'">verified</mat-icon>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-grid { display: grid; gap: 20px; padding: 20px; }
    .status-tag { color: var(--aethelgard-green); border: 1px solid; padding: 2px 8px; }
    .custom-progress { height: 10px; margin: 10px 0; }
  `]
})
export class PlayerProfileComponent {
  playerID = '8892-F';
  role = 'Hacker';
  experience = 45;
  badges = [{name: 'Primer Nodo', earned: true}, {name: 'Donador', earned: true}, {name: 'Elite', earned: false}];
}
