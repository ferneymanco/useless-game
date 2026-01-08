import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'dashboard-regular',
    loadComponent: () => import('./dashboard-regular/dashboard-regular').then(m => m.DashboardRegular)
  },
  {
    path: 'dashboard-elite',
    loadComponent: () => import('./dashboard-elite/dashboard-elite').then(m => m.DashboardElite)
  },
  {
    path: 'profile',
    loadComponent: () => import('./profile/profile').then(m => m.Profile)
  },
  {
    path: 'aptitud-test',
    loadComponent: () => import('./aptitud-test/aptitud-test').then(m => m.AptitudTest)
  },
  { path: '', redirectTo: 'dashboard-regular', pathMatch: 'full' }
];
