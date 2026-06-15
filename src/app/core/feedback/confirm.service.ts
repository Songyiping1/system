import { Injectable, signal } from '@angular/core';

export interface ConfirmOptions {
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  /** 危险操作:确认按钮用红色,用于删除/离职等 */
  danger?: boolean;
}

interface ConfirmRequest extends ConfirmOptions {
  resolve: (ok: boolean) => void;
}

/**
 * 全局确认弹窗 —— Promise 化,业务里 await 即可。
 *
 * 用法:
 *   const ok = await this.confirm.ask({
 *     title: '办理离职', message: '确定为该成员办理离职?', danger: true,
 *   });
 *   if (!ok) return;
 *
 * 渲染由根部的 <app-confirm-host> 负责。
 */
@Injectable({ providedIn: 'root' })
export class ConfirmService {
  readonly request = signal<ConfirmRequest | null>(null);

  ask(options: ConfirmOptions): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.request.set({ ...options, resolve });
    });
  }

  /** host 回调:确认/取消 */
  settle(ok: boolean): void {
    const req = this.request();
    if (!req) return;
    req.resolve(ok);
    this.request.set(null);
  }
}
