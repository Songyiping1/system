import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'menu-manage', pathMatch: 'full' },
  { path: 'menu-manage', loadComponent: () => import('./pages/menu-manage/menu-manage').then(m => m.MenuManage) },
  { path: 'menu-assign', loadComponent: () => import('./pages/menu-assign/menu-assign').then(m => m.MenuAssign) },
  { path: 'company-resource', loadComponent: () => import('./pages/company-resource/company-resource').then(m => m.CompanyResource) },
  { path: 'course-company', loadComponent: () => import('./pages/course-company/course-company').then(m => m.CourseCompany) },
  { path: 'application-list', loadComponent: () => import('./pages/application-list/application-list').then(m => m.ApplicationList) },
];
