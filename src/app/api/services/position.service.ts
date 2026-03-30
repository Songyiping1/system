// src/app/api/services/position.service.ts
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpService } from '../request/http.service';
import { ApiResponse, PositionUpsertCommand, PositionVo } from '../types';
import { UserVo } from '../types';

@Injectable({ providedIn: 'root' })
export class PositionApiService {
  private http = inject(HttpService);

  /** 创建岗位 */
  createPosition(body: PositionUpsertCommand): Observable<void> {
    return this.http.post<void>('/position/create', body);
  }

  /** 更新岗位 */
  updatePosition(body: PositionUpsertCommand): Observable<void> {
    return this.http.post<void>('/position/update', body);
  }

  /** 删除岗位 */
  removePosition(body: { id: string; companyId: string }): Observable<void> {
    return this.http.post<void>('/position/remove', body);
  }

  /** 岗位列表 */
  listPosition(params: { companyId: string; deptId?: string }): Observable<PositionVo[]> {
    return this.http.get<ApiResponse<PositionVo[]>>('/position/list', params as Record<string, string>).pipe(map(res => res.items));
  }

  /** 岗位详情 */
  getPositionDetail(params: { id: string }): Observable<PositionVo> {
    return this.http.get<PositionVo>('/position/detail', params);
  }

  /** 岗位下用户列表 */
  listPositionUser(params: { positionId: string; companyId: string }): Observable<UserVo[]> {
    return this.http.get<ApiResponse<UserVo[]>>('/position/user/list', params).pipe(map(res => res.items));
  }
}
