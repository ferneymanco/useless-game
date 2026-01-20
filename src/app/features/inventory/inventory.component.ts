//features/inventory.component.ts
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { InventoryService } from '../../core/services/inventory.service';
import { GlobalItem } from '../../core/models/inventory.model';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent {
  private functions = inject(Functions);
  private inventoryService = inject(InventoryService);
  inventory = this.inventoryService.fullInventory;
  loadingItem = signal<string | null>(null); // Para mostrar un spinner en el item usado
  isRecharging = signal<boolean>(false);
   /*  inventory = signal<InventoryItem[]>([
        { id: 'signal_fragment', name: 'Signal Fragment', description: 'Corrupted data recovered from the Decryptor.', icon: 'memory', rarity: 'COMMON', quantity: 5, category: 'INTEL', isUsable: true, effectType: 'REVEAL_HINT' },
        { id: 'encryption_core', name: 'Encryption Core', description: 'High-end hardware for secure servers.', icon: 'security', rarity: 'RARE', quantity: 1, category: 'HARDWARE', isUsable: true, effectType: 'BOOST_XP' },
        { id: 'aethelgard_access_key', name: 'Aethelgard Access Key', description: 'Master key of the loyalty network.', icon: 'key', rarity: 'LEGENDARY', quantity: 1, category: 'SOFTWARE', isUsable: true, effectType: 'REDUCE_COOLDOWN' }
    ]); */
  async useItem(item: GlobalItem) {
    if (!item.isUsable || item.quantity <= 0) return;


    if (item.id === 'energy_cell') {
      const useFn = httpsCallable(this.functions, 'useEnergyCell');
    
      try {
        // Disparar animación de carga (puedes usar un flag CSS)
        this.isRecharging.set(true); 
        
        const result: any = await useFn();
        
        if (result.data.success) {
          // Feedback auditivo o visual
          console.log("SISTEMA: Núcleo reestablecido a " + result.data.newEnergy);
        }
      } catch (error) {
        alert("ERROR: Fallo en la transferencia de energía.");
      } finally {
        setTimeout(() => this.isRecharging.set(false), 1000);
      }
    }



    this.loadingItem.set(item.id);
    const useFn = httpsCallable(this.functions, 'consumeItem');

    try {
      const result: any = await useFn({ itemId: item.id });
      
      if (result.data.success) {
        // Actualizamos la lista local o refrescamos desde el servicio
        console.log("EFECTO ACTIVADO:", result.data.intel);
        alert(`SISTEMA: ${result.data.message}`);
      }
    } catch (error) {
      console.error("Error al procesar el objeto", error);
    } finally {
      this.loadingItem.set(null);
    }
  }

  async onDismantle(itemId: string) {
    if (!confirm('¿Deseas desmantelar este residuo? Se perderá el objeto original.')) return;

    const dismantleFn = httpsCallable(this.functions, 'dismantleItem');
    
    try {
      const result: any = await dismantleFn({ itemId });
      if (result.data.success) {
        // Notificación de éxito con los materiales
        const report = result.data.recovered
          .map((m: any) => `${m.qty}x ${m.id.replace('_', ' ')}`)
          .join(', ');
          
        alert(`SISTEMA: Recuperación completada. Materiales obtenidos: ${report}`);
      }
    } catch (error) {
      console.error("Error en el desmantelamiento", error);
    }
  }

}
