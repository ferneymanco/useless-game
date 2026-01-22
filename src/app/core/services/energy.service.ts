//services/energy.service.ts
import { inject, Injectable, signal, computed, effect } from '@angular/core';
import { PlayerService } from './player.service';

@Injectable({ providedIn: 'root' })
export class EnergyService {
  private playerService = inject(PlayerService);
  
  // Signal que emite la energía calculada
  currentEnergy = signal(0);
  public maxEnergy = computed(() => this.playerService.player()?.maxEnergy || 100);
  
  private intervalId: any = null;
  
  constructor() {
    // Cada vez que los datos del jugador cambien, reiniciamos el segundero
    effect(() => {
      const player = this.playerService.player();
      if (player) {
        this.startRegenTimer();
      }
    });
  }

  private startRegenTimer() {
    // Limpiar intervalo anterior si existe
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    this.intervalId = setInterval(() => {
      const p = this.playerService.player();
      if (!p) return;

      const now = Math.floor(Date.now() / 1000);
      const lastUpdate = p.lastEnergyUpdate?.seconds || now;
      const elapsed = now - lastUpdate;
      const regenRate = p.regenRate || 60; // Default: 1 energy per minute
      const regenerated = Math.floor(elapsed / regenRate);
      
      const currentStored = p.energy || 0;
      const maxCap = p.maxEnergy || 100;
      const total = Math.min(maxCap, currentStored + regenerated);
      
      this.currentEnergy.set(total);
    }, 1000);
  }

  // Método para consumir energía (llamar desde componentes)
  async consumeEnergy(amount: number): Promise<boolean> {
    const current = this.currentEnergy();
    if (current >= amount) {
      this.currentEnergy.set(current - amount);
      // Aquí deberías actualizar Firestore también
      return true;
    }
    return false;
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
