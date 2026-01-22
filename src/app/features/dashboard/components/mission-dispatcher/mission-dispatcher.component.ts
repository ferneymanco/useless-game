import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MissionService } from '../../../../core/services/mission.service';
import { PlayerService } from '../../../../core/services/player.service';
import { MatDialog } from '@angular/material/dialog';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { MissionCodeDialogComponent } from '../mission-code-dialog/mission-code-dialog.component';

@Component({
  selector: 'app-mission-dispatcher',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './mission-dispatcher.component.html',
  styleUrls: ['./mission-dispatcher.component.scss']
})
export class MissionDispatcherComponent {
  private missionService = inject(MissionService);
  private playerService = inject(PlayerService);
  private dialog = inject(MatDialog);
  private functions = inject(Functions);
  showLevelUpEffect = false;
nextLevelValue = 1;

  // Obtenemos el rol del signal del jugador
  playerRole = computed(() => this.playerService.player()?.role || 'recruit');
  
  // Obtenemos el observable de misiones disponibles
  missions$ = this.missionService.getAvailableMissions();

  ngOnInit() {
    this.missions$.subscribe(missions => {
      console.log('Missions:', missions);
    })
  }

  triggerLevelUp(level: number) {
      this.nextLevelValue = level;
      this.showLevelUpEffect = true;
      
      // Sonido de sistema (opcional)
      const audio = new Audio('assets/sounds/level-up.mp3');
      audio.play().catch(() => {});

      // Ocultar el efecto tras 3 segundos
      setTimeout(() => {
        this.showLevelUpEffect = false;
      }, 3000);
    }

  async openMission(mission: any) {
    const dialogRef = this.dialog.open(MissionCodeDialogComponent, {
      data: { mission },
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(async (code) => {
      if (code) {
        // 2. AQUÍ DEFINIMOS completeFn
        // 'syncMissionProgress' debe coincidir exactamente con el nombre en functions/src/missions.ts
        const completeFn = httpsCallable(this.functions, 'syncMissionProgress',{ timeout: 10000 });
        
        try {
          // 3. Ejecutamos la función pasando los parámetros
          const result: any = await completeFn({ 
            missionId: mission.id, 
            inputCode: code,
            _t: Date.now()
          });

          if (result.data.success) {
            // Si hubo Level Up, disparamos el efecto que creamos antes
            if (result.data.leveledUp) {
              this.triggerLevelUp(result.data.nextLevel);
            } else {
              alert(`PROTOCOL SUCCESS: +${result.data.newXp} XP`);
            }
          } else {
            alert('ACCESS DENIED: ' + result.data.message);
          }
        } catch (err) {
          console.error('Connection lost with Aethelgard:', err);
          alert('CRITICAL ERROR: Could not reach the server.');
        }
      }
    });
  }
}
