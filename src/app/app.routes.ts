import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './guards/auth.guard';
import { AppLayoutComponent } from './layout/app-layout.component';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.LoginComponent),
  },
  {
    path: 'admin',
    component: AppLayoutComponent,
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'menu-manage', pathMatch: 'full' },
      {
        path: 'menu-manage',
        loadComponent: () =>
          import('./pages/menu-manage/menu-manage.component').then((m) => m.MenuManageComponent),
      },
      {
        path: 'menu-assign',
        loadComponent: () =>
          import('./pages/menu-assign/menu-assign.component').then((m) => m.MenuAssignComponent),
      },
      {
        path: 'company-resource',
        loadComponent: () =>
          import('./pages/company-resource/company-resource.component').then(
            (m) => m.CompanyResourceComponent
          ),
      },
      {
        path: 'course-company',
        loadComponent: () =>
          import('./pages/course-company/course-company.component').then(
            (m) => m.CourseCompanyComponent
          ),
      },
      {
        path: 'application-list',
        loadComponent: () =>
          import('./pages/application-list/application-list.component').then(
            (m) => m.ApplicationListComponent
          ),
      },
    ],
  },
  {
    path: 'user',
    component: AppLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'member-manage', pathMatch: 'full' },
      {
        path: 'member-manage',
        loadComponent: () =>
          import('./pages/member-manage/member-manage.component').then(
            (m) => m.MemberManageComponent
          ),
      },
      {
        path: 'role-manage',
        loadComponent: () =>
          import('./pages/role-manage/role-manage.component').then((m) => m.RoleManageComponent),
      },
      {
        path: 'position-manage',
        loadComponent: () =>
          import('./pages/position-manage/position-manage.component').then(
            (m) => m.PositionManageComponent
          ),
      },
      {
        path: 'group-hierarchy',
        loadComponent: () =>
          import('./pages/group-hierarchy/group-hierarchy.component').then(
            (m) => m.GroupHierarchyComponent
          ),
      },
      {
        path: 'group-application',
        loadComponent: () =>
          import('./pages/group-application-list/group-application-list.component').then(
            (m) => m.GroupApplicationListComponent
          ),
      },
      {
        path: 'menu-assign',
        loadComponent: () =>
          import('./pages/user-menu-assign/user-menu-assign.component').then(
            (m) => m.UserMenuAssignComponent
          ),
      },
      {
        path: 'admin-assign',
        loadComponent: () =>
          import('./pages/admin-assign/admin-assign.component').then(
            (m) => m.AdminAssignComponent
          ),
      },
      {
        path: 'member-permission',
        loadComponent: () =>
          import('./pages/member-permission/member-permission.component').then(
            (m) => m.MemberPermissionComponent
          ),
      },
      {
        path: 'permission-query',
        loadComponent: () =>
          import('./pages/permission-query/permission-query.component').then(
            (m) => m.PermissionQueryComponent
          ),
      },
      {
        path: 'member-perm-change',
        loadComponent: () =>
          import('./pages/member-permission-change/member-permission-change.component').then(
            (m) => m.MemberPermissionChangeComponent
          ),
      },
    ],
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];
