export interface Mission {
  id: string;
  title: string;
  description: string;
  requiredRole: string;
  minLevel: number;
  xpReward: number;
  objectiveCode: string;
  type: string;
  isCompleted?: boolean; // Campo opcional que agregamos dinámicamente
}
