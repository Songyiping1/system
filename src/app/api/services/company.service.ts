// src/app/api/services/company.service.ts
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpService } from '../request/http.service';
import { ApiResponse, CompanyUpsertCommand, ApplyReviewCommand, CompanyMatchVo, CompanyVo, TreeNodeCompanyVo } from '../types';

@Injectable({ providedIn: 'root' })
export class CompanyApiService {
  private http = inject(HttpService);

  /** 搜索匹配公司 */
  searchCompanies(params: { keyword: string; pageNum: number }): Observable<CompanyMatchVo[]> {
    return this.http.get<ApiResponse<CompanyMatchVo[]>>('/company/match', params).pipe(map(res => res.items));
  }

  /** 创建公司 */
  createCompany(body: CompanyUpsertCommand): Observable<void> {
    return this.http.post<void>('/company/create', body);
  }

  /** 更新公司 */
  updateCompany(body: CompanyUpsertCommand): Observable<void> {
    return this.http.post<void>('/company/update', body);
  }

  /** 申请入驻 */
  applyCompany(body: CompanyUpsertCommand): Observable<void> {
    return this.http.post<void>('/company/apply', body);
  }

  /** 入驻申请列表 */
  listApply(params: { companyId: string; applyStatus?: number }): Observable<CompanyVo[]> {
    return this.http.get<ApiResponse<CompanyVo[]>>('/company/apply/list', params as Record<string, string | number>).pipe(map(res => res.items));
  }

  /** 审核入驻申请 */
  reviewApply(body: ApplyReviewCommand): Observable<void> {
    return this.http.post<void>('/company/apply/review', body);
  }

  /** 加载公司列表(按类型) */
  loadCompanies(params: { type: string }): Observable<CompanyVo[]> {
    return this.http.get<ApiResponse<CompanyVo[]>>('/company/load', params).pipe(map(res => res.items));
  }

  /** 公司树形列表 */
  listCompanies(params?: { companyId: string }): Observable<TreeNodeCompanyVo[]> {
    return this.http.get<ApiResponse<TreeNodeCompanyVo[]>>('/company/list', params).pipe(map(res => res.items));
  }

  /** 删除公司(物理删除) */
  removeCompany(params: { id: string }): Observable<void> {
    return this.http.get<void>('/company/remove', params);
  }
}
