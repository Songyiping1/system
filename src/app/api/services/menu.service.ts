// src/app/api/services/menu.service.ts
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpService } from '../request/http.service';
import { ApiResponse, MenuUpsertCommand, MenuAssignCommand, MenuDragCommand, Menu, TreeNodeMenu, TreeNodeAuthMenuVo, AuthDiffVo } from '../types';

@Injectable({ providedIn: 'root' })
export class MenuApiService {
  private http = inject(HttpService);

  /** 创建菜单 */
  createMenu(body: MenuUpsertCommand): Observable<void> {
    return this.http.post<void>('/menu/create', body);
  }

  /** 菜单详情 */
  getMenuDetail(params: { id: string }): Observable<Menu> {
    return this.http.get<Menu>('/menu/detail', params);
  }

  /** 更新菜单 */
  updateMenu(body: MenuUpsertCommand): Observable<void> {
    return this.http.post<void>('/menu/update', body);
  }

  /** 删除菜单 */
  removeMenu(body: { ids: string[] }): Observable<void> {
    return this.http.post<void>('/menu/remove', body);
  }

  /** 获取菜单树（root 查全量，admin 查已分配） */
  loadMenuTree(): Observable<TreeNodeMenu[]> {
    return this.http.get<ApiResponse<TreeNodeMenu[]>>('/menu/load').pipe(map(res => res.items));
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
    return this.http.get<ApiResponse<string[]>>('/menu/assigned', params).pipe(map(res => res.items));
  }

  /** 获取已分配菜单树 */
  getAssignedMenuList(params: { companyId: string }): Observable<TreeNodeMenu[]> {
    return this.http.get<ApiResponse<TreeNodeMenu[]>>('/menu/assigned/list', params).pipe(map(res => res.items));
  }

  /** 获取当前用户有权限的菜单 */
  getAuthMenuList(params: { companyId: string }): Observable<TreeNodeMenu[]> {
    return this.http.get<ApiResponse<TreeNodeMenu[]>>('/menu/auth', params).pipe(map(res => res.items));
  }

  /** 用户权限审计菜单树 */
  getUserAuthTree(params: { companyId: string; userId: string }): Observable<TreeNodeAuthMenuVo[]> {
    return this.http.get<ApiResponse<TreeNodeAuthMenuVo[]>>('/menu/user/auth', params).pipe(map(res => res.items));
  }

  /** 用户权限对比 */
  getAuthDiff(params: { companyId: string; fromUserId: string; toUserId: string }): Observable<AuthDiffVo> {
    return this.http.get<ApiResponse<AuthDiffVo>>('/menu/user/auth/diff', params).pipe(map(res => res.items));
  }
}
