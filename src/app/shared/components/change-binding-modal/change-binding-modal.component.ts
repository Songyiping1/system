import { Component, input, output, signal, computed, OnDestroy } from '@angular/core';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-change-binding-modal',
  standalone: true,
  imports: [ModalComponent],
  templateUrl: './change-binding-modal.component.html',
  styleUrl: './change-binding-modal.component.scss',
})
export class ChangeBindingModalComponent implements OnDestroy {
  visible = input(false);
  closed = output<void>();

  // --- 表单字段 ---
  verifyCode = signal('');
  newPhone = signal('');

  // --- 验证码倒计时 ---
  codeCountdown = signal(0);
  hasSentCode = signal(false);
  private countdownTimer: ReturnType<typeof setInterval> | null = null;

  // --- computed ---
  canSubmit = computed(() =>
    this.verifyCode().length > 0 &&
    this.newPhone().length > 0
  );

  codeButtonText = computed(() => {
    const cd = this.codeCountdown();
    if (cd > 0) return `${cd} 秒后可重新获取`;
    return this.hasSentCode() ? '重新获取验证码' : '获取验证码';
  });

  ngOnDestroy() {
    this.clearTimer();
  }

  onGetCode() {
    if (this.codeCountdown() > 0) return;
    this.hasSentCode.set(true);
    this.codeCountdown.set(60);
    this.countdownTimer = setInterval(() => {
      this.codeCountdown.update(v => {
        if (v <= 1) {
          if (this.countdownTimer) clearInterval(this.countdownTimer);
          return 0;
        }
        return v - 1;
      });
    }, 1000);
  }

  onSubmit() {
    if (!this.canSubmit()) return;
    // TODO: 调用修改绑定 API
  }

  onClose() {
    this.clearTimer();
    this.reset();
    this.closed.emit();
  }

  private reset() {
    this.verifyCode.set('');
    this.newPhone.set('');
    this.codeCountdown.set(0);
    this.hasSentCode.set(false);
  }

  private clearTimer() {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
      this.countdownTimer = null;
    }
  }
}
