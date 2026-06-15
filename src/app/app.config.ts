import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { loadingInterceptor } from './core/http/loading.interceptor';
import { errorInterceptor } from './core/http/error.interceptor';
import { authInterceptor } from './core/http/auth.interceptor';
import { responseInterceptor } from './core/http/response.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    // withViewTransitions:路由切换走浏览器原生 View Transition,
    // 配合 styles.css 的 ::view-transition 规则,得到丝滑页面转场。
    provideRouter(routes, withViewTransitions()),
    // interceptor 顺序(外→内)很重要:
    //   loading  —— 最外层,统计所有在途请求驱动顶部进度条
    //   error    —— 在 auth 之外:仅当刷新重试彻底失败才弹 Toast
    //   auth     —— 盖 Bearer token;401 自动刷新 + 重放原请求
    //   response —— 最内层,拆壳(成功透传 data / 失败归一成 ApiError)
    provideHttpClient(
      withInterceptors([
        loadingInterceptor,
        errorInterceptor,
        authInterceptor,
        responseInterceptor,
      ]),
    ),
  ],
};
