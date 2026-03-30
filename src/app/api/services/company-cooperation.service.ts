// src/app/api/services/company-cooperation.service.ts
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpService } from '../request/http.service';
import { ApiResponse, CooperationApplyCommand, CooperationApplyReviewCommand, CooperationDetailVo, CooperationApplyVo } from '../types';
import { TreeNodeCompanyVo } from '../types/company.type';

@Injectable({ providedIn: 'root' })
export class CompanyCooperationApiService {
  private http = inject(HttpService);

  /** 合作公司树形列表 */
  getCooperationList(params: { companyId: string }): Observable<TreeNodeCompanyVo[]> {
    return this.http.get<ApiResponse<TreeNodeCompanyVo[]>>('/company/cooperation/list', params).pipe(map(res => res.items));
  }

  /** 合作详情 */
  getCooperationDetail(params: { companyId: string }): Observable<CooperationDetailVo> {
    return this.http.get<ApiResponse<CooperationDetailVo>>('/company/cooperation/detail', params).pipe(map(res => res.items));
  }

  /** 申请合作 */
  applyCooperation(body: CooperationApplyCommand): Observable<void> {
    return this.http.post<void>('/company/cooperation/apply', body);
  }

  /** 审核合作申请 */
  reviewCooperationApply(body: CooperationApplyReviewCommand): Observable<void> {
    return this.http.post<void>('/company/cooperation/apply/review', body);
  }

  /** 合作申请列表 */
  listCooperationApply(params: { companyId: string; status?: number }): Observable<CooperationApplyVo[]> {
    return this.http.get<ApiResponse<CooperationApplyVo[]>>('/company/cooperation/apply/list', params as Record<string, string | number>).pipe(map(res => res.items));
  }
}
