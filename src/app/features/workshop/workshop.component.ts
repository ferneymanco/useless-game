//features/workshop.component.ts
import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { InventoryService } from '../../core/services/inventory.service';
import { CRAFTING_RECIPES } from '../../core/models/crafting.model';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LORE_MESSAGES } from '../../core/constants/lore.constants';
import { FormsModule } from "@angular/forms";
import { EnergyService } from '../../core/services/energy.service';

@Component({
  selector: 'app-workshop',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, FormsModule],
  templateUrl: './workshop.component.html',
  styleUrls: ['./workshop.component.scss']
})
export class WorkshopComponent {
  private invService = inject(InventoryService);
  private functions = inject(Functions);
  private snackBar = inject(MatSnackBar);
  lastCraftedItem = signal<any | null>(null);
  showSuccessOverlay = signal<boolean>(false);
  currentLore = signal<{sender: string, text: string[], currentIndex: number} | null>(null);
  displayedText = signal<string>('');
  energyService = inject(EnergyService);
  
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
        resultRarity: resultItem?.rarity,
        ingredientsStatus
      };
    });
  });

  async onCraft(recipeId: string) {
    const recipe = this.enrichedRecipes().find(r => r.id === recipeId);
    if (!recipe) return;

    this.isCrafting.set(recipeId);
    const craftFn = httpsCallable(this.functions, 'craftItem');
    
    try {
      const result: any = await craftFn({ recipeId });
      const { craftedItem, status } = result.data;
      
      if (status === 'UNSTABLE_COLLAPSE') {
        this.lastCraftedItem.set({
            id: "unstable_scrap",
            resultName: 'COLLAPSE DETECTED',
            resultIcon: 'warning',
            resultRarity: 'COMMON',
            isUnstable: true
        });
        this.showSuccessOverlay.set(true);
        this.triggerLore('unstable_failure'); 
      } else {
        const recipe = this.enrichedRecipes().find(r => r.id === recipeId);
        this.lastCraftedItem.set({ ...recipe, isUnstable: false });

        this.showSuccessOverlay.set(true);
        //this.triggerLore(craftedItem);
      }

      await this.energyService.consumeEnergy(recipe.energyCost);
    } catch (error) {

      let error_message = error?.toString().replace("FirebaseError: ", "").replace(/(\r\n|\n|\r)/gm, " ") || 'Connection unstable';
      this.snackBar.open('CRAFTING ERROR: Connection unstable', error_message, { duration: 5000 });
    
    } finally {
      this.isCrafting.set(null);
    }
  }

  triggerLore(itemId: string) {
    const lore = LORE_MESSAGES[itemId];
    if (lore) {
      this.currentLore.set({ ...lore, currentIndex: 0 });
      this.typeWriterEffect(lore.text[0]);
    }
  }

  private typeWriterEffect(fullText: string) {
    this.displayedText.set('');
    let i = 0;
    const interval = setInterval(() => {
      this.displayedText.update(t => t + fullText.charAt(i));
      i++;
      if (i === fullText.length) clearInterval(interval);
    }, 30);
  }

  nextLoreLine() {
    const current = this.currentLore();
    if (!current) return;

    if (current.currentIndex < current.text.length - 1) {
      const nextIdx = current.currentIndex + 1;
      this.currentLore.set({ ...current, currentIndex: nextIdx });
      this.typeWriterEffect(current.text[nextIdx]);
    } else {
      this.currentLore.set(null);
    }
  }

  addVault() {
    const vaultFn = httpsCallable(this.functions, 'addItem');
    vaultFn({ itemId: this.lastCraftedItem()?.resultItemId, quantity: 1 }).then((result: any) => {
      this.closeOverlay();
    });
  }

  closeOverlay() {
    this.showSuccessOverlay.set(false);
    this.lastCraftedItem.set(null);
  }
  
}
