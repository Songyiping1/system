import { inject } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpRequest,
} from '@angular/common/http';
import { Router } from '@angular/router';
import {
  Observable,
  catchError,
  throwError,
} from 'rxjs';
import { TokenStorage } from '../auth/token.storage';
import { SKIP_AUTH } from './http-context';
import { ApiError } from './api-response.model';

/**
 * 平台管理员认证 interceptor —— 注入 token + 401 清理登录态。
 *
 * 流程:
 *   1. 非匿名请求盖上 Authorization: Bearer <platformAccessToken>
 *   2. 命中 401 时清本地平台管理员登录态并跳回登录页
 */
export function authInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  const tokenStorage = inject(TokenStorage);
  const router = inject(Router);

  const skipAuth = req.context.get(SKIP_AUTH);
  const token = tokenStorage.accessToken;
  const authReq = withToken(req, skipAuth ? null : token);

  return next(authReq).pipe(
    catchError((err: unknown) => {
      // 匿名接口或非 401 → 原样上抛
      if (skipAuth || !isUnauthorized(err)) {
        return throwError(() => err);
      }
      forceLogout(tokenStorage, router);
      return throwError(() => err);
    }),
  );
}

/** 给请求盖 token(token 为空则原样返回) */
function withToken(
  req: HttpRequest<unknown>,
  token: string | null,
): HttpRequest<unknown> {
  return token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;
}

/** 401 判定:response 拦截器可能已把 401 归一成 ApiError(httpStatus=401) */
function isUnauthorized(err: unknown): boolean {
  if (err instanceof HttpErrorResponse) return err.status === 401;
  if (err instanceof ApiError) return err.httpStatus === 401;
  return false;
}

/** 平台 token 失效:清 token + 跳登录(带 returnUrl) */
function forceLogout(tokenStorage: TokenStorage, router: Router): void {
  tokenStorage.clear();
  const returnUrl = router.url;
  router.navigate(['/login'], {
    queryParams:
      returnUrl && returnUrl !== '/login' ? { returnUrl } : undefined,
  });
}
