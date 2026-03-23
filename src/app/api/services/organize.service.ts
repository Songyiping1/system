// src/app/api/services/organize.service.ts
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../request/http.service';
import {
  OrganizeUpsertCommand,
  OrganizeRemoveCommand,
  TreeNodeOrganize,
  PermissionLogQuery,
  PermissionLogVo,
} from '../types';

@Injectable({ providedIn: 'root' })
export class OrganizeApiService {
  private http = inject(HttpService);

  /** 创建部门 */
  createOrganize(body: OrganizeUpsertCommand): Observable<void> {
    return this.http.post<void>('/organize/create', body);
  }

  /** 加载组织架构树 */
  loadOrganize(params: { companyId: string }): Observable<TreeNodeOrganize[]> {
    return this.http.get<TreeNodeOrganize[]>('/organize/load', params);
  }

  /** 更新部门 */
  updateOrganize(body: OrganizeUpsertCommand): Observable<void> {
    return this.http.post<void>('/organize/update', body);
  }

  /** 删除部门 */
  deleteOrganize(params: { id: string; companyId: string }): Observable<void> {
    return this.http.delete<void>('/organize/delete', params);
  }

  /** 设置部门主管 */
  setDeptLeader(body: { companyId: string; deptId: string; userId: string }): Observable<void> {
    return this.http.post<void>('/organize/dept/leader', body);
  }

  /** 权限操作日志列表 */
  getPermissionList(body: PermissionLogQuery): Observable<PermissionLogVo[]> {
    return this.http.post<PermissionLogVo[]>('/organize/permission/list', body);
  }

  /** 解绑用户 */
  unBindUser(body: { companyId: string; userId: string }): Observable<void> {
    return this.http.post<void>('/organize/unBindUser', body);
  }
}
