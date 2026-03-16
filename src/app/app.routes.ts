import { Routes } from '@angular/router';

export const routes: Routes = [

  { path: '', redirectTo: 'menu-manage', pathMatch: 'full' },
  //内部菜单配置
  //菜单管理
  { path: 'menu-manage', loadComponent: () => import('./pages/menu-manage/menu-manage').then(m => m.MenuManage) },
  //菜单分配
  { path: 'menu-assign', loadComponent: () => import('./pages/menu-assign/menu-assign').then(m => m.MenuAssign) },
  //公司资源管理
  { path: 'company-resource', loadComponent: () => import('./pages/company-resource/company-resource').then(m => m.CompanyResource) },
  //课程公司管理
  { path: 'course-company', loadComponent: () => import('./pages/course-company/course-company').then(m => m.CourseCompany) },
  //入驻申请列表
  { path: 'application-list', loadComponent: () => import('./pages/application-list/application-list').then(m => m.ApplicationList) },
  //外部菜单配置
  //菜单分配
  { path: 'menu-assign-new', loadComponent: () => import('./pages/menu-assign-new/menu-assign-new').then(m => m.MenuAssignNew) },
  //管理员分配
  { path: 'admin-assign', loadComponent: () => import('./pages/admin-assign/admin-assign').then(m => m.AdminAssign) },
  //菜单权限查询
  { path: 'permission-query', loadComponent: () => import('./pages/permission-query/permission-query').then(m => m.PermissionQuery) },
  //成员菜单权限变更
  { path: 'member-permission-change', loadComponent: () => import('./pages/member-permission-change/member-permission-change').then(m => m.MemberPermissionChange) },
  //成员管理权限
  { path: 'member-admin-permission', loadComponent: () => import('./pages/member-admin-permission/member-admin-permission').then(m => m.MemberAdminPermission) },
  //成员管理
  { path: 'member-manage', loadComponent: () => import('./pages/member-manage/member-manage').then(m => m.MemberManage) },
  //角色管理
  { path: 'role-manage', loadComponent: () => import('./pages/role-manage/role-manage').then(m => m.RoleManage) },
  //岗位管理
  { path: 'position-manage', loadComponent: () => import('./pages/position-manage/position-manage').then(m => m.PositionManage) },
  //集团上下级
  { path: 'group-hierarchy', loadComponent: () => import('./pages/group-hierarchy/group-hierarchy').then(m => m.GroupHierarchy) },
  //集团上下级申请列表
  { path: 'group-application-list', loadComponent: () => import('./pages/group-application-list/group-application-list').then(m => m.GroupApplicationList) },
];
