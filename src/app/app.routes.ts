import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'menu-manage', pathMatch: 'full' },
  { path: 'menu-manage', loadComponent: () => import('./pages/menu-manage/menu-manage').then(m => m.MenuManage) },
  { path: 'menu-assign', loadComponent: () => import('./pages/menu-assign/menu-assign').then(m => m.MenuAssign) },
  { path: 'company-resource', loadComponent: () => import('./pages/company-resource/company-resource').then(m => m.CompanyResource) },
  { path: 'course-company', loadComponent: () => import('./pages/course-company/course-company').then(m => m.CourseCompany) },
  { path: 'application-list', loadComponent: () => import('./pages/application-list/application-list').then(m => m.ApplicationList) },
  { path: 'menu-assign-new', loadComponent: () => import('./pages/menu-assign-new/menu-assign-new').then(m => m.MenuAssignNew) },
  { path: 'admin-assign', loadComponent: () => import('./pages/admin-assign/admin-assign').then(m => m.AdminAssign) },
  { path: 'permission-query', loadComponent: () => import('./pages/permission-query/permission-query').then(m => m.PermissionQuery) },
  { path: 'member-permission-change', loadComponent: () => import('./pages/member-permission-change/member-permission-change').then(m => m.MemberPermissionChange) },
  { path: 'member-admin-permission', loadComponent: () => import('./pages/member-admin-permission/member-admin-permission').then(m => m.MemberAdminPermission) },
  { path: 'member-manage', loadComponent: () => import('./pages/member-manage/member-manage').then(m => m.MemberManage) },
  { path: 'role-manage', loadComponent: () => import('./pages/role-manage/role-manage').then(m => m.RoleManage) },
  { path: 'position-manage', loadComponent: () => import('./pages/position-manage/position-manage').then(m => m.PositionManage) },
  { path: 'group-hierarchy', loadComponent: () => import('./pages/group-hierarchy/group-hierarchy').then(m => m.GroupHierarchy) },
  { path: 'group-application-list', loadComponent: () => import('./pages/group-application-list/group-application-list').then(m => m.GroupApplicationList) },
];
