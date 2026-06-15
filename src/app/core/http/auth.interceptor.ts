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
  finalize,
  map,
  of,
  shareReplay,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { TokenStorage } from '../auth/token.storage';
import { SKIP_AUTH } from './http-context';
import { ApiError } from './api-response.model';
import { AuthService } from '../../features/auth/auth.service';

/**
 * 认证 interceptor —— 注入 token + 401 自动刷新重试。
 *
 * 流程:
 *   1. 非匿名请求盖上 Authorization: Bearer <accessToken>
 *   2. 命中 401 时,用 refreshToken 静默换新 token,然后重放原请求
 *   3. 刷新失败 → 清 token + 跳登录(把原错误继续上抛给 errorInterceptor)
 *
 * 多个并发 401 只触发一次刷新(单飞),其余共享同一刷新结果。
 */

/** 单飞:进行中的刷新流(成功 true / 失败 false) */
let refresh$: Observable<boolean> | null = null;

export function authInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  const tokenStorage = inject(TokenStorage);
  const auth = inject(AuthService);
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

      return runRefresh(auth, tokenStorage).pipe(
        switchMap((ok) => {
          if (!ok) {
            forceLogout(tokenStorage, router);
            return throwError(() => err);
          }
          // 用新 token 重放原请求
          return next(withToken(req, tokenStorage.accessToken));
        }),
      );
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

/** 单飞刷新:首个 401 发起刷新,并发者共享同一结果 */
function runRefresh(
  auth: AuthService,
  tokenStorage: TokenStorage,
): Observable<boolean> {
  const refreshToken = tokenStorage.refreshToken;
  if (!refreshToken) return of(false);

  if (!refresh$) {
    refresh$ = auth.refreshToken(refreshToken).pipe(
      tap((res) => tokenStorage.setTokens(res.accessToken, res.refreshToken)),
      map(() => true),
      catchError(() => of(false)),
      finalize(() => {
        refresh$ = null;
      }),
      shareReplay(1),
    );
  }
  return refresh$;
}

/** 刷新失败:清 token + 跳登录(带 returnUrl) */
function forceLogout(tokenStorage: TokenStorage, router: Router): void {
  tokenStorage.clear();
  const returnUrl = router.url;
  router.navigate(['/login'], {
    queryParams:
      returnUrl && returnUrl !== '/login' ? { returnUrl } : undefined,
  });
}
