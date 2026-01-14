//features/inventory.component.ts
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { PlayerService } from '../../core/services/player.service';
import { InventoryItem } from '../../core/models/inventory.model';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="inventory-screen">
      <div class="header">
        <mat-icon>inventory_2</mat-icon>
        <h2>SECURE STORAGE / VAULT</h2>
      </div>

      <div class="items-grid">
        @for (item of inventory(); track item.id) {
          <div class="item-card" [attr.data-rarity]="item.rarity">
            <div class="quantity-badge">{{ item.quantity }}</div>
            <mat-icon class="item-icon">{{ item.icon }}</mat-icon>
            <div class="item-info">
              <span class="item-name">{{ item.name }}</span>
              <span class="item-category">{{ item.category }}</span>
            </div>
            <div class="item-description">{{ item.description }}</div>
          </div>
        } @empty {
          <div class="empty-vault">
            <p>VAULT EMPTY. COMPLETE MISSIONS TO GATHER RESOURCES.</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .inventory-screen { padding: 20px; }
    .header { display: flex; align-items: center; gap: 10px; margin-bottom: 30px; border-bottom: 1px solid #333; padding-bottom: 10px; }
    
    .items-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
      gap: 15px;
    }

    .item-card {
      background: rgba(0,0,0,0.5);
      border: 1px solid #333;
      padding: 15px;
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      transition: all 0.2s;
      cursor: help;
    }

    /* Colores por rareza (Usando el Color de la Lealtad para LEGENDARY) */
    .item-card[data-rarity="COMMON"] { border-left: 3px solid #888; }
    .item-card[data-rarity="RARE"] { border-left: 3px solid #00ffff; }
    .item-card[data-rarity="LEGENDARY"] { border-left: 3px solid #FFB300; box-shadow: inset 0 0 10px rgba(255, 179, 0, 0.2); }

    .item-card:hover { border-color: #FFB300; background: rgba(255,179,0,0.05); transform: translateY(-2px); }

    .quantity-badge {
      position: absolute;
      top: 5px; right: 5px;
      background: #333;
      font-size: 0.7rem;
      padding: 2px 6px;
      border-radius: 10px;
    }

    .item-icon { font-size: 2.5rem; width: 40px; height: 40px; margin-bottom: 10px; color: #666; }
    .item-name { display: block; font-size: 0.8rem; font-weight: bold; text-align: center; }
    .item-category { display: block; font-size: 0.6rem; color: #555; text-align: center; margin-top: 4px; }

    .item-description {
      position: absolute;
      bottom: 100%; left: 0; width: 200px;
      background: #111; border: 1px solid #FFB300; color: #ccc;
      padding: 10px; font-size: 0.7rem; display: none; z-index: 10;
    }
    .item-card:hover .item-description { display: block; }
  `]
})
export class InventoryComponent {
  // Aquí luego conectaremos con el servicio para traer los datos reales
  inventory = signal<InventoryItem[]>([
    { id: '1', name: 'Fragmento de Señal', description: 'Datos corruptos recuperados del Decryptor.', icon: 'memory', rarity: 'COMMON', quantity: 5, category: 'INTEL' },
    { id: '2', name: 'Núcleo de Encriptación', description: 'Hardware de alta gama para servidores seguros.', icon: 'security', rarity: 'RARE', quantity: 1, category: 'HARDWARE' },
    { id: '3', name: 'Aethelgard Access Key', description: 'Llave maestra de la red de lealtad.', icon: 'key', rarity: 'LEGENDARY', quantity: 1, category: 'SOFTWARE' }
  ]);
}
