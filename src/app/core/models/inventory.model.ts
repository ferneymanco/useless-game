export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  icon: string; // Nombre del MatIcon
  rarity: 'COMMON' | 'UNCOMMON' | 'RARE' | 'LEGENDARY';
  quantity: number;
  category: 'HARDWARE' | 'SOFTWARE' | 'INTEL';
}
