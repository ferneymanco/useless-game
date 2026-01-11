import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerService } from '../../../../core/services/player.service';

@Component({
  selector: 'app-xp-progress-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="xp-system">
      <div class="xp-header">
        <span>CORE LEVEL: {{ currentLevel() }}</span>
        <span>{{ currentXp() }} / {{ nextLevelXp() }} XP</span>
      </div>
      <div class="progress-track">
        <div class="progress-fill" [style.width.%]="progressPercentage()"></div>
      </div>
    </div>
  `,
  styles: [`
    .xp-system { margin-bottom: 2rem; font-family: 'Courier New', monospace; }
    .xp-header { display: flex; justify-content: space-between; color: #ffb000; font-size: 0.8rem; margin-bottom: 5px; }
    .progress-track { height: 10px; background: #222; border: 1px solid #444; overflow: hidden; }
    .progress-fill { 
      height: 100%; 
      background: linear-gradient(90deg, #ffb000, #ffcc80);
      box-shadow: 0 0 10px #ffb000;
      transition: width 1s cubic-bezier(0.4, 0, 0.2, 1); // La magia de la animación
    }
  `]
})
export class XpProgressBarComponent {
  private playerService = inject(PlayerService);
  
  currentXp = computed(() => this.playerService.player()?.experience || 0);
  currentLevel = computed(() => this.playerService.player()?.accessLevel || 1);
  
  // Lógica simple: cada nivel requiere (Nivel * 500) XP
  nextLevelXp = computed(() => this.currentLevel() * 500);
  progressPercentage = computed(() => (this.currentXp() / this.nextLevelXp()) * 100);
}
