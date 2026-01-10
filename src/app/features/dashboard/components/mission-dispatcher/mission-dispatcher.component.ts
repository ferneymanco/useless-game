import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MissionService } from '../../../../core/services/mission.service';
import { PlayerService } from '../../../../core/services/player.service';

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

  // Obtenemos el rol del signal del jugador
  playerRole = this.playerService.player()?.role || 'recruit';
  
  // Obtenemos el observable de misiones disponibles
  missions$ = this.missionService.getAvailableMissions();

  openMission(mission: any) {
    console.log('Initializing mission protocol:', mission.title);
    // Aquí abriremos un diálogo o modal para ingresar el Objective Code
  }
}
