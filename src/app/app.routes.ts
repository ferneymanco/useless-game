import { Routes } from '@angular/router';
import { AptitudeTestComponent } from './features/aptitude-test/aptitude-test.component';
import { PlayerProfileComponent } from './features/profile/player-profile.component';
import { RegularDashboardComponent } from './features/dashboard/regular-dashboard.component';
import { EliteDashboardComponent } from './features/dashboard/elite-dashboard.component';
import { DonationComponent } from './features/donation/donation.component';
import { EliteGuard } from './core/guards/elite.guard';
import { MissionDispatcherComponent } from './features/dashboard/components/mission-dispatcher/mission-dispatcher.component';

export const routes: Routes = [
  { path: 'test', component: AptitudeTestComponent },
  { path: 'profile', component: PlayerProfileComponent },
  { path: 'dashboard', component: RegularDashboardComponent },
  { path: 'donate', component: DonationComponent },
  { path: 'elite-access', component: EliteDashboardComponent, canActivate: [EliteGuard] },
  { path: 'missions', component: MissionDispatcherComponent },
  //{ path: '', redirectTo: '/test', pathMatch: 'full' }
];
