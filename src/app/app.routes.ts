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
    canActivate: [authGuard],
    loadComponent: () => import('./shell/admin/admin-shell').then((m) => m.AdminShell),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'users',
      },
      {
        path: 'users',
        loadComponent: () => import('./pages/users/users').then((m) => m.UsersPage),
        title: '用户管理 · PassAuth Console',
      },
      {
        path: 'onboarding',
        loadComponent: () =>
          import('./pages/onboarding-review/onboarding-review').then((m) => m.OnboardingReviewPage),
        title: '入驻审核 · PassAuth Console',
      },
      {
        path: 'session',
        pathMatch: 'full',
        redirectTo: 'users',
      },
    ],
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
