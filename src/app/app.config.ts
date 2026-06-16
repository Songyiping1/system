import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter, withViewTransitions } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { BrandPreset } from './theme/brand-preset';

import { routes } from './app.routes';
import { loadingInterceptor } from './core/http/loading.interceptor';
import { errorInterceptor } from './core/http/error.interceptor';
import { authInterceptor } from './core/http/auth.interceptor';
import { responseInterceptor } from './core/http/response.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    // PrimeNG:BrandPreset(基于 Aura,主色/表面已换成品牌 token,见
    // theme/brand-preset.ts)。darkModeSelector 对齐我们 token 的
    // [data-theme="dark"],切暗色时组件与自定义层一致。
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: BrandPreset,
        options: {
          darkModeSelector: '[data-theme="dark"]',
        },
      },
    }),
    // withViewTransitions:路由切换走浏览器原生 View Transition,
    // 配合 styles.css 的 ::view-transition 规则,得到丝滑页面转场。
    provideRouter(routes, withViewTransitions()),
    // interceptor 顺序(外→内)很重要:
    //   loading  —— 最外层,统计所有在途请求驱动顶部进度条
    //   error    —— 在 auth 之外,统一弹业务错误 Toast
    //   auth     —— 盖平台管理员 Bearer token;401 清本地登录态
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
