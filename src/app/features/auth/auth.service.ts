import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  SKIP_AUTH,
  SKIP_ERROR_TOAST,
  SKIP_LOADING,
} from '../../core/http/http-context';
import { getDeviceId, DEVICE_TYPE } from '../../core/auth/device';
import {
  AuthEnvironmentResult,
  LoginResult,
  PasswordLoginRequest,
} from './auth.model';

/**
 * 认证接口 service。
 * 走 pass-authx /authx/* 域。登录是匿名接口,带 SKIP_AUTH 跳过 token 注入。
 * interceptor 已拆壳,这里直接拿到 LoginResult(无需读 .data)。
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  /** 密码登录 —— POST /authx/login/password */
  passwordLogin(mobile: string, password: string): Observable<LoginResult> {
    const body: PasswordLoginRequest = {
      mobile,
      password,
      deviceId: getDeviceId(),
      deviceType: DEVICE_TYPE,
    };
    return this.http.post<LoginResult>('/authx/login/password', body, {
      // 登录页自行内联报错,不弹全局 Toast
      context: new HttpContext().set(SKIP_AUTH, true).set(SKIP_ERROR_TOAST, true),
    });
  }

  /**
   * 刷新 token —— POST /authx/token/refresh。
   * 匿名接口(带 refreshToken 即可);静默执行,不弹错、不计进度。
   */
  refreshToken(refreshToken: string): Observable<LoginResult> {
    return this.http.post<LoginResult>(
      '/authx/token/refresh',
      { refreshToken },
      {
        context: new HttpContext()
          .set(SKIP_AUTH, true)
          .set(SKIP_ERROR_TOAST, true)
          .set(SKIP_LOADING, true),
      },
    );
  }

  /** 登出 —— POST /authx/logout(失败也不影响本地清理) */
  logout(): Observable<unknown> {
    return this.http.post(
      '/authx/logout',
      {},
      { context: new HttpContext().set(SKIP_ERROR_TOAST, true) },
    );
  }

  /**
   * 拉取登录环境 —— POST /authx/auth。
   * 需登录(带 token),一次返回用户 + 当前公司 + 公司列表 + 菜单树,
   * 用于登录后/刷新时水合全局状态。
   */
  authEnvironment(): Observable<AuthEnvironmentResult> {
    return this.http.post<AuthEnvironmentResult>('/authx/auth', {});
  }
}
