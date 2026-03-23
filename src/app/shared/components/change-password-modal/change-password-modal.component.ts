import { Component, input, output, signal, computed, OnDestroy } from '@angular/core';
import { ModalComponent } from '../modal/modal.component';

type ModalStep = 'changePwd' | 'forgotPwd' | 'confirmTip' | 'successTip';

@Component({
  selector: 'app-change-password-modal',
  standalone: true,
  imports: [ModalComponent],
  templateUrl: './change-password-modal.component.html',
  styleUrl: './change-password-modal.component.scss',
})
export class ChangePasswordModalComponent implements OnDestroy {
  visible = input(false);
  closed = output<void>();

  /** 当前步骤 */
  step = signal<ModalStep>('changePwd');

  // --- 修改密码表单 ---
  oldPassword = signal('');
  newPassword = signal('');
  confirmPassword = signal('');
  verifyCode = signal('');

  showOldPwd = signal(false);
  showNewPwd = signal(false);
  showConfirmPwd = signal(false);

  // --- 忘记密码表单 ---
  forgotCode = signal('');
  forgotNewPwd = signal('');
  forgotConfirmPwd = signal('');
  showForgotNewPwd = signal(false);
  showForgotConfirmPwd = signal(false);

  // --- 错误提示 ---
  oldPwdError = signal('');
  confirmPwdError = signal('');
  codeError = signal('');

  // --- 验证码倒计时 ---
  codeCountdown = signal(0);
  hasSentCode = signal(false);
  private countdownTimer: ReturnType<typeof setInterval> | null = null;

  // --- 成功倒计时 ---
  successCountdown = signal(5);
  private successTimer: ReturnType<typeof setInterval> | null = null;

  // --- computed ---
  canSubmitChangePwd = computed(() =>
    this.oldPassword().length > 0 &&
    this.newPassword().length > 0 &&
    this.confirmPassword().length > 0 &&
    this.verifyCode().length > 0
  );

  canSubmitForgotPwd = computed(() =>
    this.forgotCode().length > 0 &&
    this.forgotNewPwd().length > 0 &&
    this.forgotConfirmPwd().length > 0
  );

  codeButtonText = computed(() => {
    const cd = this.codeCountdown();
    if (cd > 0) return `${cd} 秒后可重新获取`;
    return this.hasSentCode() ? '重新获取验证码' : '获取验证码';
  });

  ngOnDestroy() {
    this.clearTimers();
  }

  // --- 修改密码 ---
  onSubmitChangePwd() {
    this.oldPwdError.set('');
    this.confirmPwdError.set('');
    this.codeError.set('');

    if (this.newPassword() !== this.confirmPassword()) {
      this.confirmPwdError.set('两次输入的密码不一样');
      return;
    }

    // 模拟：先弹确认提示
    this.step.set('confirmTip');
  }

  onConfirmContinue() {
    // 确认后执行修改
    this.step.set('successTip');
    this.startSuccessCountdown();
  }

  onConfirmCancel() {
    this.step.set('changePwd');
  }

  // --- 忘记密码 ---
  onGoForgot() {
    this.step.set('forgotPwd');
  }

  onBackFromForgot() {
    this.step.set('changePwd');
  }

  onSubmitForgotPwd() {
    if (!this.canSubmitForgotPwd()) return;
    if (this.forgotNewPwd() !== this.forgotConfirmPwd()) {
      return;
    }
    this.step.set('successTip');
    this.startSuccessCountdown();
  }

  // --- 验证码 ---
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

  // --- 成功倒计时 ---
  private startSuccessCountdown() {
    this.successCountdown.set(5);
    this.successTimer = setInterval(() => {
      this.successCountdown.update(v => {
        if (v <= 1) {
          if (this.successTimer) clearInterval(this.successTimer);
          this.onRelogin();
          return 0;
        }
        return v - 1;
      });
    }, 1000);
  }

  onRelogin() {
    this.clearTimers();
    this.reset();
    this.closed.emit();
    // TODO: 跳转登录页
  }

  // --- 关闭 ---
  onClose() {
    this.clearTimers();
    this.reset();
    this.closed.emit();
  }

  // --- Toggle ---
  toggleOldPwd() { this.showOldPwd.update(v => !v); }
  toggleNewPwd() { this.showNewPwd.update(v => !v); }
  toggleConfirmPwd() { this.showConfirmPwd.update(v => !v); }
  toggleForgotNewPwd() { this.showForgotNewPwd.update(v => !v); }
  toggleForgotConfirmPwd() { this.showForgotConfirmPwd.update(v => !v); }

  private reset() {
    this.step.set('changePwd');
    this.oldPassword.set('');
    this.newPassword.set('');
    this.confirmPassword.set('');
    this.verifyCode.set('');
    this.forgotCode.set('');
    this.forgotNewPwd.set('');
    this.forgotConfirmPwd.set('');
    this.oldPwdError.set('');
    this.confirmPwdError.set('');
    this.codeError.set('');
    this.codeCountdown.set(0);
    this.hasSentCode.set(false);
  }

  private clearTimers() {
    if (this.countdownTimer) { clearInterval(this.countdownTimer); this.countdownTimer = null; }
    if (this.successTimer) { clearInterval(this.successTimer); this.successTimer = null; }
  }
}
