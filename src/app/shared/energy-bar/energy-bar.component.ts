import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { EnergyService } from '../../core/services/energy.service';

@Component({
  selector: 'app-energy-bar',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './energy-bar.component.html',
  styleUrls: ['./energy-bar.component.scss']
})
export class EnergyBarComponent {
  energyService = inject(EnergyService);
  
  currentEnergy = this.energyService.currentEnergy;
  maxEnergy = this.energyService.maxEnergy;

  get energyPercentage(): number {
    const max = this.maxEnergy();
    const current = this.currentEnergy();
    return max > 0 ? (current / max) * 100 : 0;
  }

  get energyStatus(): 'critical' | 'low' | 'normal' | 'full' {
    const percentage = this.energyPercentage;
    if (percentage >= 100) return 'full';
    if (percentage >= 50) return 'normal';
    if (percentage >= 25) return 'low';
    return 'critical';
  }

}
