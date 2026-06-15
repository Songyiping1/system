import { Injectable, computed, signal } from '@angular/core';

/**
 * 全局加载计数 —— 记录在途 HTTP 请求数。
 * loadingInterceptor 进出各 +1/-1,顶部进度条据 active 显隐。
 */
@Injectable({ providedIn: 'root' })
export class LoadingService {
  private readonly count = signal(0);

  /** 是否有请求在途 */
  readonly active = computed(() => this.count() > 0);

  start(): void {
    this.count.update((c) => c + 1);
  }

  stop(): void {
    this.count.update((c) => Math.max(0, c - 1));
  }
}
