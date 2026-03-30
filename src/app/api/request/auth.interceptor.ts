// src/app/api/request/auth.interceptor.ts
import { HttpInterceptorFn, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const cookieId = localStorage.getItem('cookieId');

  const authReq = cookieId
    ? req.clone({ setHeaders: { cookieId } })
    : req;

  return next(authReq).pipe(
    map(event => {
      if (event instanceof HttpResponse && event.body != null) {
        const body = event.body as Record<string, unknown>;
        if ('isSuccess' in body && body['isSuccess'] === false) {
          throw new HttpErrorResponse({
            error: body['error'] ?? '请求失败',
            status: 200,
            statusText: 'Business Error',
            url: event.url ?? undefined,
          });
        }
      }
      return event;
    }),
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        localStorage.removeItem('cookieId');
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};
