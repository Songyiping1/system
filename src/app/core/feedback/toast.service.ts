import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: number;
  type: ToastType;
  message: string;
  /** 正在退场(用于播放离场动画后再移除) */
  leaving?: boolean;
}

const DEFAULT_DURATION = 3200;
const LEAVE_MS = 220;

/**
 * 全局 Toast 通知 —— 轻量、非阻塞的操作反馈。
 *
 * 用法:
 *   private toast = inject(ToastService);
 *   this.toast.success('保存成功');
 *   this.toast.error('删除失败,请重试');
 *
 * 渲染由根部的 <app-toast-host> 负责。
 */
@Injectable({ providedIn: 'root' })
export class ToastService {
  /** 当前可见的 toast 列表(供 host 渲染) */
  readonly toasts = signal<Toast[]>([]);

  private seq = 0;

  success(message: string, duration?: number): void {
    this.show('success', message, duration);
  }

  error(message: string, duration?: number): void {
    this.show('error', message, duration);
  }

  info(message: string, duration?: number): void {
    this.show('info', message, duration);
  }

  warning(message: string, duration?: number): void {
    this.show('warning', message, duration);
  }

  show(type: ToastType, message: string, duration = DEFAULT_DURATION): void {
    const id = ++this.seq;
    this.toasts.update((list) => [...list, { id, type, message }]);
    if (duration > 0) {
      setTimeout(() => this.dismiss(id), duration);
    }
  }

  /** 先标记退场,播放离场动画后再真正移除 */
  dismiss(id: number): void {
    this.toasts.update((list) =>
      list.map((t) => (t.id === id ? { ...t, leaving: true } : t)),
    );
    setTimeout(() => {
      this.toasts.update((list) => list.filter((t) => t.id !== id));
    }, LEAVE_MS);
  }
}
