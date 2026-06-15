import { Injectable } from '@angular/core';

const ACCESS_TOKEN_KEY = 'authx_access_token';
const REFRESH_TOKEN_KEY = 'authx_refresh_token';

/**
 * Token 存储 —— localStorage 封装。
 * 仅负责存取,不含业务逻辑(登录态由 AuthStore 管理)。
 */
@Injectable({ providedIn: 'root' })
export class TokenStorage {
  get accessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  get refreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  setTokens(accessToken: string, refreshToken?: string): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
  }

  clear(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
}
