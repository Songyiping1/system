// src/app/api/services/role.service.ts
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../request/http.service';
import { RoleUpsertCommand, RoleBindMenuCommand, RoleBindUserCommand, RoleVo, RoleMenuVo, Role } from '../types';
import { UserVo } from '../types';

@Injectable({ providedIn: 'root' })
export class RoleApiService {
  private http = inject(HttpService);

  /** 创建角色 */
  createRole(body: RoleUpsertCommand): Observable<void> {
    return this.http.post<void>('/role/create', body);
  }

  /** 更新角色 */
  updateRole(body: RoleUpsertCommand): Observable<void> {
    return this.http.post<void>('/role/update', body);
  }

  /** 角色绑定菜单 */
  bindRoleMenu(body: RoleBindMenuCommand): Observable<void> {
    return this.http.post<void>('/role/menu/bind', body);
  }

  /** 角色关联菜单列表 */
  getRoleMenuList(params: { companyId: string; roleId: string }): Observable<RoleMenuVo[]> {
    return this.http.get<RoleMenuVo[]>('/role/menu/list', params);
  }

  /** 删除角色 */
  removeRole(body: { id: string; companyId: string }): Observable<void> {
    return this.http.post<void>('/role/remove', body);
  }

  /** 角色关联用户 */
  bindRoleUser(body: RoleBindUserCommand): Observable<void> {
    return this.http.post<void>('/role/user/bind', body);
  }

  /** 角色解除用户 */
  unbindRoleUser(body: RoleBindUserCommand): Observable<void> {
    return this.http.post<void>('/role/user/unbind', body);
  }

  /** 角色绑定用户列表 */
  listRoleUser(params: { roleId: string; companyId: string }): Observable<UserVo[]> {
    return this.http.get<UserVo[]>('/role/user/list', params);
  }

  /** 角色列表 */
  listRole(params: { companyId: string; type?: string }): Observable<RoleVo[]> {
    return this.http.get<RoleVo[]>('/role/list', params as Record<string, string>);
  }

  /** 角色详情 */
  getRoleDetail(params: { id: string }): Observable<Role> {
    return this.http.get<Role>('/role/detail', params);
  }
}
