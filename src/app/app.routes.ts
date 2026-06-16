import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.LoginPage),
    title: '登录 · PassAuth Console',
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'session',
  },
  {
    path: 'session',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/session/session').then((m) => m.SessionPage),
    title: '会话 · PassAuth Console',
  },
  {
    path: 'ui-kit',
    loadComponent: () => import('./pages/ui-kit/ui-kit').then((m) => m.UiKit),
    title: 'UI Kit · 设计系统',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
