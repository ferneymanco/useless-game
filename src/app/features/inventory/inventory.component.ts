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
   /*  inventory = signal<InventoryItem[]>([
        { id: 'signal_fragment', name: 'Signal Fragment', description: 'Corrupted data recovered from the Decryptor.', icon: 'memory', rarity: 'COMMON', quantity: 5, category: 'INTEL', isUsable: true, effectType: 'REVEAL_HINT' },
        { id: 'encryption_core', name: 'Encryption Core', description: 'High-end hardware for secure servers.', icon: 'security', rarity: 'RARE', quantity: 1, category: 'HARDWARE', isUsable: true, effectType: 'BOOST_XP' },
        { id: 'aethelgard_access_key', name: 'Aethelgard Access Key', description: 'Master key of the loyalty network.', icon: 'key', rarity: 'LEGENDARY', quantity: 1, category: 'SOFTWARE', isUsable: true, effectType: 'REDUCE_COOLDOWN' }
    ]); */
  async useItem(item: GlobalItem) {
    if (!item.isUsable || item.quantity <= 0) return;

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
}
