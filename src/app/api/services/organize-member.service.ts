// src/app/api/services/organize-member.service.ts
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpService } from '../request/http.service';
import {
  ApiResponse,
  OrganizeBindCommand,
  OrganizeUserRemoveCommand,
  OrganizeUserTransferCommand,
  OrganizeUserVo,
  ImportResultVo,
} from '../types';

@Injectable({ providedIn: 'root' })
export class OrganizeMemberApiService {
  private http = inject(HttpService);

  /** 部门成员列表 */
  listOrganizeMember(params: { companyId: string; deptId: string; state?: number }): Observable<OrganizeUserVo[]> {
    return this.http.get<ApiResponse<OrganizeUserVo[]>>('/organize/member/list', params as Record<string, string | number>).pipe(map(res => res.items));
  }

  /** 添加员工 */
  addMember(body: OrganizeBindCommand): Observable<void> {
    return this.http.post<void>('/organize/member/add', body);
  }

  /** 员工离职 */
  deleteMember(body: OrganizeUserRemoveCommand): Observable<void> {
    return this.http.post<void>('/organize/member/delete', body);
  }

  /** 员工调部门 */
  transferMember(body: OrganizeUserTransferCommand): Observable<void> {
    return this.http.post<void>('/organize/member/transfer', body);
  }

  /** 员工导入模版下载 */
  downloadTemplate(params: { companyId: string }): Observable<Blob> {
    return this.http.get<Blob>('/organize/member/template', params);
  }

  /** 员工导入 */
  importMember(formData: FormData): Observable<ImportResultVo> {
    return this.http.upload<ImportResultVo>('/organize/member/import', formData);
  }
}
