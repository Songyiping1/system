import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, map, throwError, catchError } from 'rxjs';
import { ApiError, ApiResponse, isApiResponse } from './api-response.model';
import { RAW_RESPONSE } from './http-context';

/**
 * 拆壳 interceptor —— 把 pass-authx 的 { isSuccess, code, message, data } 统一处理掉。
 *
 * 默认行为(「只透传 data」):
 *   - isSuccess=true  → 把响应体替换成 data,组件 service 直接拿业务数据
 *   - isSuccess=false → 抛 ApiError(code, message),走全局错误处理
 *
 * 旁路(RAW_RESPONSE=true):跳过拆壳,完整壳透传,供需要读 code 的接口使用。
 *
 * HTTP 层错误(网络断、500、404 等):归一成 ApiError,httpStatus 带上原始状态码。
 * 401 不在此处跳转登录 —— 交给 auth.interceptor 处理,职责分离。
 */
export function responseInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  const raw = req.context.get(RAW_RESPONSE);

  return next(req).pipe(
    map((event) => {
      // 只处理最终响应,其余事件(上传进度等)原样放行
      if (!(event instanceof HttpResponse)) {
        return event;
      }

      const body = event.body;

      // 不符合返回壳形状(如文件流、SSE、第三方接口)→ 原样放行
      if (!isApiResponse(body)) {
        return event;
      }

      // 旁路:完整壳透传
      if (raw) {
        return event;
      }

      const shell = body as ApiResponse;

      // 业务失败 → 抛 ApiError
      if (!shell.isSuccess) {
        throw new ApiError(shell.code, shell.message || '请求失败', event.status);
      }

      // 业务成功 → 替换 body 为 data
      return event.clone({ body: shell.data ?? null });
    }),
    catchError((err: unknown) => {
      // 已经是 ApiError(上面 map 里抛的)→ 原样上抛
      if (err instanceof ApiError) {
        return throwError(() => err);
      }

      // HTTP 层错误 → 归一成 ApiError
      if (err instanceof HttpErrorResponse) {
        // 后端错误体若也是返回壳,优先用壳里的 message
        const errBody = err.error;
        if (isApiResponse(errBody)) {
          return throwError(
            () => new ApiError(errBody.code, errBody.message || err.message, err.status),
          );
        }
        const message =
          err.status === 0
            ? '网络连接失败,请检查网络'
            : err.message || `请求失败(${err.status})`;
        return throwError(() => new ApiError(err.status, message, err.status));
      }

      // 其余未知错误
      return throwError(() => err);
    }),
  );
}
