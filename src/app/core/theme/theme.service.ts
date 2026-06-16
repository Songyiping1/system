import { Injectable, signal } from '@angular/core';

export type ThemeMode = 'light' | 'dark';

const STORAGE_KEY = 'passauth-theme';

/**
 * 主题服务 —— 切换亮/暗色。
 *
 * 把 `data-theme` 写到 <html>,同时驱动:
 *   - 自定义 token(styles/tokens.css 的 [data-theme="dark"])
 *   - PrimeNG(providePrimeNG 的 darkModeSelector: '[data-theme="dark"]')
 * 初始值:localStorage > 系统偏好 > light。
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly theme = signal<ThemeMode>('light');
  readonly isDark = signal(false);

  constructor() {
    this.set(this.resolveInitial(), false);
  }

  toggle(): void {
    this.set(this.theme() === 'dark' ? 'light' : 'dark');
  }

  set(mode: ThemeMode, persist = true): void {
    this.theme.set(mode);
    this.isDark.set(mode === 'dark');
    this.apply(mode);
    if (persist) {
      try {
        localStorage.setItem(STORAGE_KEY, mode);
      } catch {
        /* 隐私模式等场景忽略 */
      }
    }
  }

  private resolveInitial(): ThemeMode {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {
      /* ignore */
    }
    if (
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      return 'dark';
    }
    return 'light';
  }

  private apply(mode: ThemeMode): void {
    if (typeof document === 'undefined') return;
    document.documentElement.dataset['theme'] = mode;
  }
}
