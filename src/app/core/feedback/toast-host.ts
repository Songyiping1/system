import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ToastService } from './toast.service';

/**
 * Toast 渲染宿主 —— 全局只挂一份(放在根 app 模板),
 * 固定右上角堆叠,入场上滑淡入,退场反向。
 */
@Component({
  selector: 'app-toast-host',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="toast-stack" aria-live="polite" aria-atomic="true">
      @for (t of toasts(); track t.id) {
        <div class="toast" [class]="t.type" [class.leaving]="t.leaving">
          <span class="ico">
            @switch (t.type) {
              @case ('success') {
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              }
              @case ('error') {
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" />
                </svg>
              }
              @case ('warning') {
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 9v4m0 4h.01M10.3 3.9l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3.1l-8-14a2 2 0 0 0-3.4 0z" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              }
              @default {
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 16v-5m0-3h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                  <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8" />
                </svg>
              }
            }
          </span>
          <span class="msg">{{ t.message }}</span>
          <button class="close" type="button" aria-label="关闭" (click)="toast.dismiss(t.id)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            </svg>
          </button>
        </div>
      }
    </div>
  `,
  styleUrl: './toast-host.scss',
})
export class ToastHost {
  protected readonly toast = inject(ToastService);
  protected readonly toasts = this.toast.toasts;
}
