//features/lore-database.component.ts
import { Component, inject, signal } from '@angular/core';
import { LoreService } from '../../core/services/lore.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-lore-database',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './lore-database.component.html',
  styleUrls: ['./lore-database.component.scss']
})
export class LoreDatabaseComponent {
  loreService = inject(LoreService);
  selectedEntry = signal<any | null>(null);

  selectFile(entry: any) {
    this.selectedEntry.set(entry);
  }

  getCurrentDate(): string {
    return new Date().toISOString().split('T')[0];
  }
}
