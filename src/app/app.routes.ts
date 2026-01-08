import { Routes } from '@angular/router';
import { AptitudeTestComponent } from './features/aptitude-test/aptitude-test.component';
import { PlayerProfileComponent } from './features/profile/player-profile.component';
import { RegularDashboardComponent } from './features/dashboard/regular-dashboard.component';
import { EliteDashboardComponent } from './features/dashboard/elite-dashboard.component';
import { DonationComponent } from './features/donation/donation.component';
import { EliteGuard } from './core/guards/elite.guard';

export const routes: Routes = [
  { path: 'test', component: AptitudeTestComponent },
  { path: 'profile', component: PlayerProfileComponent },
  { path: 'dashboard', component: RegularDashboardComponent },
  { path: 'donate', component: DonationComponent },
  { path: 'elite-access', component: EliteDashboardComponent, canActivate: [EliteGuard] },
  //{ path: '', redirectTo: '/test', pathMatch: 'full' }
];
