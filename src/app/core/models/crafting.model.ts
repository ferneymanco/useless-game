// src/app/core/models/crafting.model.ts
export interface CraftingRecipe {
  id: string;
  resultItemId: string;
  resultQuantity: number;
  ingredients: { itemId: string; quantity: number }[];
  levelRequired: number;
}

export const CRAFTING_RECIPES: CraftingRecipe[] = [
  {
    id: 'craft_neural_link',
    resultItemId: 'neural_link',
    resultQuantity: 1,
    ingredients: [{ itemId: 'damaged_ram', quantity: 10 }],
    levelRequired: 3
  },
  {
    id: 'craft_bypass',
    resultItemId: 'security_bypass',
    resultQuantity: 1,
    ingredients: [{ itemId: 'signal_fragment', quantity: 5 }],
    levelRequired: 2
  }
];
