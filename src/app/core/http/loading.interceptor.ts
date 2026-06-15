import { inject } from '@angular/core';
import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { LoadingService } from './loading.service';
import { SKIP_LOADING } from './http-context';

/**
 * 加载 interceptor —— 进出各计数一次,驱动顶部进度条。
 * SKIP_LOADING 标记的静默请求(刷新 token/轮询)不计入。
 */
export function loadingInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  if (req.context.get(SKIP_LOADING)) {
    return next(req);
  }
  const loading = inject(LoadingService);
  loading.start();
  return next(req).pipe(finalize(() => loading.stop()));
}
