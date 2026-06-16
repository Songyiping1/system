import { inject } from '@angular/core';
import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { ApiError } from './api-response.model';
import { SKIP_ERROR_TOAST } from './http-context';
import { ToastService } from '../feedback/toast.service';

/**
 * 错误 Toast interceptor —— 统一把失败弹成全局提示,业务里不必每处手写。
 *
 * 注册在 auth 之外、response 之外:
 *   - auth 负责 401 清理登录态,其他错误继续向外冒泡
 *   - response 已把 HTTP/业务错误归一成 ApiError,这里直接读 message
 * SKIP_ERROR_TOAST 的接口自行处理报错,不弹。
 */
export function errorInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  const toast = inject(ToastService);
  const skip = req.context.get(SKIP_ERROR_TOAST);

  return next(req).pipe(
    catchError((err: unknown) => {
      if (!skip) {
        toast.error(messageOf(err));
      }
      return throwError(() => err);
    }),
  );
}

function messageOf(err: unknown): string {
  if (err instanceof ApiError) {
    if (err.httpStatus === 401) return '登录已过期,请重新登录';
    return err.message || '请求失败';
  }
  return '请求失败,请稍后重试';
}
