import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'dashboard-regular',
    loadComponent: () => import('./dashboard-regular/dashboard-regular.component').then(m => m.DashboardRegularComponent)
  },
  {
    path: 'dashboard-elite',
    loadComponent: () => import('./dashboard-elite/dashboard-elite.component').then(m => m.DashboardEliteComponent)
  },
  {
    path: 'profile',
    loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent)
  },
  {
    path: 'aptitud-test',
    loadComponent: () => import('./aptitud-test/aptitud-test.component').then(m => m.AptitudTestComponent)
  },
  { path: '', redirectTo: 'dashboard-regular', pathMatch: 'full' }
];
