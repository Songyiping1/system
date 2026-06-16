import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { PageResult } from '../../shared/models/page-result';
import {
  CompanyApply,
  CompanyApplyQuery,
  CompanyApplyReviewRequest,
  SystemUser,
  SystemUserDetail,
  SystemUserQuery,
  SystemUserStateUpdate,
} from './system.model';

@Injectable({ providedIn: 'root' })
export class SystemService {
  private readonly http = inject(HttpClient);

  queryUsers(query: SystemUserQuery): Observable<PageResult<SystemUser>> {
    return this.http.post<PageResult<SystemUser>>('/system/users/query', {
      keyword: query.keyword ?? '',
      state: query.state ?? '',
      page: query.page,
      size: query.size,
    });
  }

  userDetail(userId: string): Observable<SystemUserDetail> {
    return this.http.get<SystemUserDetail>(`/system/users/${userId}`);
  }

  updateUserState(userId: string, state: SystemUserStateUpdate['state']): Observable<SystemUser> {
    return this.http.put<SystemUser>(`/system/users/${userId}/state`, { state });
  }

  revokeUserSessions(userId: string): Observable<void> {
    return this.http.post<void>(`/system/users/${userId}/sessions/revoke`, {});
  }

  queryApplications(query: CompanyApplyQuery): Observable<PageResult<CompanyApply>> {
    return this.http.post<PageResult<CompanyApply>>('/system/onboarding/review/applications/list', {
      state: query.state ?? '',
      page: query.page,
      size: query.size,
    });
  }

  applicationDetail(applicationId: string): Observable<CompanyApply> {
    return this.http.get<CompanyApply>(`/system/onboarding/review/applications/${applicationId}`);
  }

  approveApplication(
    applicationId: string,
    request: CompanyApplyReviewRequest,
  ): Observable<CompanyApply> {
    return this.http.post<CompanyApply>(
      `/system/onboarding/review/applications/${applicationId}/approve`,
      request,
    );
  }

  rejectApplication(
    applicationId: string,
    request: CompanyApplyReviewRequest,
  ): Observable<CompanyApply> {
    return this.http.post<CompanyApply>(
      `/system/onboarding/review/applications/${applicationId}/reject`,
      request,
    );
  }
}
