import { Routes } from '@angular/router';
import { AptitudeTestComponent } from './features/aptitude-test/aptitude-test.component';
import { PlayerProfileComponent } from './features/profile/player-profile.component';
import { RegularDashboardComponent } from './dashboard-regular/dashboard-regular';
import { EliteDashboardComponent } from './dashboard-elite/dashboard-elite';
import { EliteGuard } from './core/guards/elite.guard';

export const routes: Routes = [
  { path: 'test', component: AptitudeTestComponent },
  { path: 'profile', component: PlayerProfileComponent },
  { path: 'dashboard', component: RegularDashboardComponent },
  { path: 'elite-access', component: EliteDashboardComponent, canActivate: [EliteGuard] },
  //{ path: '', redirectTo: '/test', pathMatch: 'full' }
];
