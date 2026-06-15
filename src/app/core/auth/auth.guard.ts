import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { Observable, map } from 'rxjs';
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
 * - 有 token 但未水合:调一次 store.hydrate() 拉登录环境,
 *   成功放行;失败跳 /login(401 已由 auth.interceptor 兜底)。
 * - 已水合:放行。
 */
export const authGuard: CanActivateFn = (
  _route,
  state,
): boolean | UrlTree | Observable<boolean | UrlTree> => {
  const store = inject(AuthStore);
  const tokenStorage = inject(TokenStorage);
  const router = inject(Router);

  if (!tokenStorage.accessToken) {
    return toLogin(router, state.url);
  }

  if (store.hydrated()) {
    return true;
  }

  return store
    .hydrate()
    .pipe(map((ok) => (ok ? true : toLogin(router, state.url))));
};
