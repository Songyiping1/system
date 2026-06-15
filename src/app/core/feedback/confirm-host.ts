import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  inject,
} from '@angular/core';
import { ConfirmService } from './confirm.service';

/**
 * 确认弹窗渲染宿主 —— 全局只挂一份(放在根 app 模板)。
 * 遮罩淡入 + 对话框缩放浮入;Esc 取消、点遮罩取消。
 */
@Component({
  selector: 'app-confirm-host',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (request(); as req) {
      <div class="overlay" (click)="onOverlay($event)">
        <div class="dialog" role="alertdialog" aria-modal="true">
          <h2 class="title">{{ req.title }}</h2>
          @if (req.message) {
            <p class="message">{{ req.message }}</p>
          }
          <div class="actions">
            <button class="btn cancel" type="button" (click)="confirm.settle(false)">
              {{ req.cancelText || '取消' }}
            </button>
            <button
              class="btn ok"
              [class.danger]="req.danger"
              type="button"
              (click)="confirm.settle(true)"
            >
              {{ req.confirmText || '确定' }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styleUrl: './confirm-host.scss',
})
export class ConfirmHost {
  protected readonly confirm = inject(ConfirmService);
  protected readonly request = this.confirm.request;

  onOverlay(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('overlay')) {
      this.confirm.settle(false);
    }
  }

  @HostListener('document:keydown.escape')
  onEsc(): void {
    if (this.request()) {
      this.confirm.settle(false);
    }
  }
}
