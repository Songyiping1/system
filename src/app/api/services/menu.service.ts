// src/app/api/services/menu.service.ts
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../request/http.service';
import { MenuUpsertCommand, MenuAssignCommand, MenuDragCommand, Menu, TreeNodeMenu, TreeNodeAuthMenuVo, AuthDiffVo } from '../types';

@Injectable({ providedIn: 'root' })
export class MenuApiService {
  private http = inject(HttpService);

  /** 创建菜单 */
  createMenu(body: MenuUpsertCommand): Observable<void> {
    return this.http.post<void>('/menu/create', body);
  }

  /** 菜单详情 */
  getMenuDetail(params: { menuId: string }): Observable<Menu> {
    return this.http.get<Menu>('/menu/detail', params);
  }

  /** 更新菜单 */
  updateMenu(body: MenuUpsertCommand): Observable<void> {
    return this.http.post<void>('/menu/update', body);
  }

  /** 删除菜单 */
  removeMenu(body: { id: string }): Observable<void> {
    return this.http.post<void>('/menu/remove', body);
  }

  /** 获取菜单树 */
  loadMenuTree(params: { companyId?: string }): Observable<TreeNodeMenu[]> {
    return this.http.get<TreeNodeMenu[]>('/menu/load', params as Record<string, string>);
  }

  /** 拖拽排序菜单 */
  dragMenu(body: MenuDragCommand): Observable<void> {
    return this.http.post<void>('/menu/drag', body);
  }

  /** 菜单分配给公司 */
  assignMenu(body: MenuAssignCommand): Observable<void> {
    return this.http.post<void>('/menu/assign', body);
  }

  /** 获取已分配菜单ID列表 */
  getAssignedMenuIds(params: { companyId: string }): Observable<string[]> {
    return this.http.get<string[]>('/menu/assigned', params);
  }

  /** 获取已分配菜单树 */
  getAssignedMenuList(params: { companyId: string }): Observable<TreeNodeMenu[]> {
    return this.http.get<TreeNodeMenu[]>('/menu/assigned/list', params);
  }

  /** 获取当前用户有权限的菜单 */
  getAuthMenuList(params: { companyId: string }): Observable<TreeNodeMenu[]> {
    return this.http.get<TreeNodeMenu[]>('/menu/auth', params);
  }

  /** 用户权限审计菜单树 */
  getUserAuthTree(params: { companyId: string; userId: string }): Observable<TreeNodeAuthMenuVo[]> {
    return this.http.get<TreeNodeAuthMenuVo[]>('/menu/user/auth', params);
  }

  /** 用户权限对比 */
  getAuthDiff(params: { companyId: string; fromUserId: string; toUserId: string }): Observable<AuthDiffVo> {
    return this.http.get<AuthDiffVo>('/menu/user/auth/diff', params);
  }
}
