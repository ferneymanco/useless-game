import { Routes } from '@angular/router';
import { AptitudeTestComponent } from './features/aptitude-test/aptitude-test.component';
import { PlayerProfileComponent } from './features/profile/player-profile.component';
import { RegularDashboardComponent } from './features/dashboard/regular-dashboard.component';
import { EliteDashboardComponent } from './features/dashboard/elite-dashboard.component';
import { DonationComponent } from './features/donation/donation.component';
import { EliteGuard } from './core/guards/elite.guard';
import { MissionDispatcherComponent } from './features/dashboard/components/mission-dispatcher/mission-dispatcher.component';
import { DecryptorComponent } from './features/decryptor/decryptor.component';
import { levelGuard } from './core/guards/level.guard';
import { LeaderboardComponent } from './features/leaderboard/leaderboard.component';
import { InventoryComponent } from './features/inventory/inventory.component';
import { WorkshopComponent } from './features/workshop/workshop.component';
import { LoreDatabaseComponent } from './features/lore-database/lore-database.component';
import { EnergyBarComponent } from './shared/energy-bar/energy-bar.component';
import { Main } from './site/components/main/main';

export const routes: Routes = [
  { path: 'test', component: AptitudeTestComponent },
  { path: 'profile', component: PlayerProfileComponent },
  { path: 'dashboard', component: RegularDashboardComponent },
  { path: 'donate', component: DonationComponent },
  { path: 'elite-access', component: EliteDashboardComponent, canActivate: [EliteGuard] },
  { path: 'missions', component: MissionDispatcherComponent },
  { 
    path: 'admin', 
    loadComponent: () => import('./features/admin/admin-console.component').then(m => m.AdminConsoleComponent) 
  },
  { 
    path: 'decryptor', 
    component: DecryptorComponent,
    canActivate: [levelGuard(2)]
  },
  { path: 'leaderboard', component: LeaderboardComponent, /* canActivate: [levelGuard(3)]  */},
  { path: 'inventory', component: InventoryComponent, /* canActivate: [levelGuard(2)] */ },
  { path: 'workshop', component: WorkshopComponent, /* canActivate: [levelGuard(2)] */ },
  { path: 'lore', component: LoreDatabaseComponent, /* canActivate: [levelGuard(2)] */ },
  { path: 'energy', component: EnergyBarComponent },
  { path: 'main', component: Main },
  { path: '', redirectTo: '/main', pathMatch: 'full' }
];
