import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'quick-add',
    loadComponent: () => import('./pages/quick-add/quick-add.page').then( m => m.QuickAddPage)
  },
];
