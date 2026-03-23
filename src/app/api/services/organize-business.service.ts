// src/app/api/services/organize-business.service.ts
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../request/http.service';
import { ModuleManagerCommand, BizDict } from '../types';

@Injectable({ providedIn: 'root' })
export class OrganizeBusinessApiService {
  private http = inject(HttpService);

  /** 业务模块列表 */
  getBusinessList(params: { companyId: string }): Observable<BizDict[]> {
    return this.http.get<BizDict[]>('/organize/business/list', params);
  }

  /** 设置业务模块负责人 */
  setBusinessManager(body: ModuleManagerCommand): Observable<void> {
    return this.http.post<void>('/organize/business/manager', body);
  }

  /** 用户已分配业务模块 */
  getAssignedBusinessList(params: { companyId: string; userId: string }): Observable<number[]> {
    return this.http.get<number[]>('/organize/business/assigned', params);
  }
}
