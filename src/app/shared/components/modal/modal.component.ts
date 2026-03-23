import { Component, input, output, signal, HostListener } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent {
  /** 弹窗标题 */
  title = input.required<string>();

  /** 弹窗尺寸: sm(460px) / md(620px) / lg(778px) / xl(900px) / auto */
  size = input<'sm' | 'md' | 'lg' | 'xl' | 'auto'>('md');

  /** 圆角: 小弹窗 8px, 大弹窗 16px */
  radius = input<8 | 16>(8);

  /** 是否显示 */
  visible = input(false);

  /** 是否显示头部 */
  showHeader = input(true);

  /** 是否显示关闭按钮 */
  showClose = input(true);

  /** 是否显示返回按钮 */
  showBack = input(false);

  /** 是否显示底部按钮区 */
  showFooter = input(true);

  /** 确认按钮文案 */
  confirmText = input('确定');

  /** 取消按钮文案 */
  cancelText = input('取消');

  /** 是否只显示确认按钮（无取消） */
  confirmOnly = input(false);

  /** 关闭事件 */
  closed = output<void>();

  /** 确认事件 */
  confirmed = output<void>();

  /** 返回事件 */
  backed = output<void>();

  onOverlayClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.closed.emit();
    }
  }

  onClose() {
    this.closed.emit();
  }

  onBack() {
    this.backed.emit();
  }

  onCancel() {
    this.closed.emit();
  }

  onConfirm() {
    this.confirmed.emit();
  }
}
