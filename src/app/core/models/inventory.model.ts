export interface GlobalItem {
  id: string;
  name: string;
  description: string;
  icon: string; // Nombre del MatIcon
  rarity: 'COMMON' | 'UNCOMMON' | 'RARE' | 'LEGENDARY';
  quantity: number;
  category: 'HARDWARE' | 'SOFTWARE' | 'INTEL';
  isUsable: boolean; // ¿Se puede consumir?
  effectType?: 'REVEAL_HINT' | 'BOOST_XP' | 'REDUCE_COOLDOWN';
  isDismantlable: boolean;
}

export interface UserItemRecord {
  id: string; // Este ID coincide con el del catálogo
  quantity: number;
}

export interface InventorySlot extends GlobalItem {
  quantity: number;
}
