//features/workshop.component.ts
import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { InventoryService } from '../../core/services/inventory.service';
import { CRAFTING_RECIPES } from '../../core/models/crafting.model';
import { Functions, httpsCallable } from '@angular/fire/functions';

@Component({
  selector: 'app-workshop',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './workshop.component.html',
  styleUrls: ['./workshop.component.css']
})
export class WorkshopComponent {
  private invService = inject(InventoryService);
  private functions = inject(Functions);
  
  recipes = CRAFTING_RECIPES;
  isCrafting = signal<string | null>(null);

  // Cruzamos las recetas con el catálogo global para mostrar nombres/iconos
  enrichedRecipes = computed(() => {
    const catalog = this.invService.globalCatalog();
    const myItems = this.invService.userInventoryRecords();

    return this.recipes.map(recipe => {
      const resultItem = catalog.find(i => i.id === recipe.resultItemId);
      const ingredientsStatus = recipe.ingredients.map(ing => {
        const itemInfo = catalog.find(i => i.id === ing.itemId);
        const myQty = myItems.find(mi => mi.id === ing.itemId)?.['quantity'] || 0;
        return { ...itemInfo, required: ing.quantity, owned: myQty, hasEnough: myQty >= ing.quantity };
      });

      return {
        ...recipe,
        resultName: resultItem?.name,
        resultIcon: resultItem?.icon,
        canCraft: ingredientsStatus.every(i => i.hasEnough),
        ingredientsStatus
      };
    });
  });

  async onCraft(recipeId: string) {
    this.isCrafting.set(recipeId);
    const craftFn = httpsCallable(this.functions, 'craftItem');
    
    try {
      await craftFn({ recipeId });
      // El inventario se actualizará solo gracias a los Signals
    } finally {
      this.isCrafting.set(null);
    }
  }
}
