import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/ui-kit/ui-kit').then((m) => m.UiKit),
    title: 'UI Kit · 设计系统',
  },
];
