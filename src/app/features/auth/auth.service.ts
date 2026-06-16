import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SKIP_AUTH, SKIP_ERROR_TOAST } from '../../core/http/http-context';
import { PlatformAdminLoginRequest, PlatformAdminLoginResult } from './auth.model';

/**
 * 认证接口 service。
 * 平台管理员是独立账号体系:只走 /platform/auth/login,
 * 不创建普通用户会话,也不水合普通用户环境。
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  /** 平台管理员登录 —— POST /platform/auth/login */
  platformAdminLogin(account: string, password: string): Observable<PlatformAdminLoginResult> {
    const body: PlatformAdminLoginRequest = {
      account,
      password,
    };
    return this.http.post<PlatformAdminLoginResult>('/platform/auth/login', body, {
      // 登录页自行内联报错,不弹全局 Toast
      context: new HttpContext().set(SKIP_AUTH, true).set(SKIP_ERROR_TOAST, true),
    });
  }
}
