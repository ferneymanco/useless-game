import { Timestamp } from "@angular/fire/firestore";

export type PlayerRole = 'hacker' | 'tracker' | 'engineer' | 'analyst' | 'recruit';

export interface PlayerProfile {
  uid: string;
  labelId: string;       // e.g., #8892-X
  role: PlayerRole;
  accessLevel: number;
  experience: number;
  isDonor: boolean;
  isElite: boolean;
  foundNodes: string[];  // Array of node IDs discovered
  unlockedFeatures: string[]; // List of features unlocked through game or donations
  donorLevel: string; // e.g., 'recruit'
  paymentId?: string; // Para auditoría
  completedMissions: string[]; // Array de IDs de misiones completadas
  decryptedNodes?: number; // Nodos descifrados
  currentBadge?: string; // Badge equipado
  unlockedLore?: string[]; // Array de IDs de lore desbloqueados
  maxEnergy?: number;
  lastEnergyUpdate?: Timestamp;
  regenRate?: number;
  energy?: number;
}
