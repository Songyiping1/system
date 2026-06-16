import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthStore } from './auth.store';
import { TokenStorage } from './token.storage';

/** 构造跳登录的 UrlTree,带 returnUrl 便于登录后回跳 */
function toLogin(router: Router, returnUrl: string): UrlTree {
  return router.createUrlTree(['/login'], {
    queryParams: returnUrl && returnUrl !== '/' ? { returnUrl } : undefined,
  });
}

/**
 * authGuard —— 主应用区路由守卫。
 *
 * - 无 token:直接跳 /login(带 returnUrl)。
 * - 有 token:从本地恢复平台管理员 profile,成功放行。
 * - 平台管理员后端当前没有 /me 或 refresh 接口,401 由 auth.interceptor 兜底清理。
 */
export const authGuard: CanActivateFn = (
  _route,
  state,
): boolean | UrlTree => {
  const store = inject(AuthStore);
  const tokenStorage = inject(TokenStorage);
  const router = inject(Router);

  if (!tokenStorage.accessToken) {
    return toLogin(router, state.url);
  }

  if (store.isLoggedIn() || store.restoreFromStorage()) {
    return true;
  }

  return toLogin(router, state.url);
};
