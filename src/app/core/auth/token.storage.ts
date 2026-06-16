import { Injectable } from '@angular/core';
import {
  PlatformAdminLoginResult,
  PlatformAdminProfile,
  toPlatformAdminProfile,
} from '../../features/auth/auth.model';

const ACCESS_TOKEN_KEY = 'passauth_platform_access_token';
const PROFILE_KEY = 'passauth_platform_admin_profile';
const LEGACY_ACCESS_TOKEN_KEY = 'authx_access_token';
const LEGACY_REFRESH_TOKEN_KEY = 'authx_refresh_token';

/**
 * 平台管理员 token 存储 —— localStorage 封装。
 *
 * system 后台使用独立平台管理员账号体系,不复用普通用户登录态。
 */
@Injectable({ providedIn: 'root' })
export class TokenStorage {
  get accessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  get profile(): PlatformAdminProfile | null {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as PlatformAdminProfile;
    } catch {
      this.clear();
      return null;
    }
  }

  setPlatformSession(result: PlatformAdminLoginResult): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, result.accessToken);
    localStorage.setItem(PROFILE_KEY, JSON.stringify(toPlatformAdminProfile(result)));
    localStorage.removeItem(LEGACY_ACCESS_TOKEN_KEY);
    localStorage.removeItem(LEGACY_REFRESH_TOKEN_KEY);
  }

  clear(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(PROFILE_KEY);
    localStorage.removeItem(LEGACY_ACCESS_TOKEN_KEY);
    localStorage.removeItem(LEGACY_REFRESH_TOKEN_KEY);
  }
}
