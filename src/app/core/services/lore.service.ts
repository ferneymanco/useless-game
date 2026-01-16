//services/lore.service.ts
import { inject, Injectable, computed } from '@angular/core';
import { PlayerService } from './player.service'; // Asumiendo que aquí tienes los datos del jugador
import { LORE_MESSAGES } from '../constants/lore.constants';

@Injectable({ providedIn: 'root' })
export class LoreService {
  private playerService = inject(PlayerService);

  // Signal computado que devuelve solo el lore que el usuario posee
  unlockedEntries = computed(() => {
    const player = this.playerService.player(); // Signal del jugador actual
    const unlockedIds = player?.unlockedLore || [];
    
    return unlockedIds.map(id => ({
      id,
      ...LORE_MESSAGES[id]
    })).filter(entry => entry.sender); // Limpiar nulos
  });
}
