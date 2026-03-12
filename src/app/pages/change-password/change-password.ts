import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgTemplateOutlet } from '@angular/common';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';

type Step = 'input' | 'input-countdown' | 'forgot' | 'confirm' | 'success';

@Component({
  selector: 'app-change-password',
  imports: [FormsModule, NgTemplateOutlet, DialogComponent],
  templateUrl: './change-password.html',
  styleUrl: './change-password.scss',
})
export class ChangePassword {
  readonly visible = signal(false);
  readonly step = signal<Step>('input');

  readonly oldPassword = signal('');
  readonly newPassword = signal('');
  readonly confirmPassword = signal('');
  readonly captcha = signal('');

  readonly showOldPwd = signal(false);
  readonly showNewPwd = signal(false);
  readonly showConfirmPwd = signal(false);

  readonly countdown = signal(0);
  private countdownTimer: ReturnType<typeof setInterval> | null = null;

  readonly dialogTitle = computed(() => {
    return this.step() === 'forgot' ? '忘记密码' : '修改密码';
  });

  readonly isBackStep = computed(() => this.step() === 'forgot');

  readonly canSubmit = computed(() => {
    const step = this.step();
    if (step === 'input' || step === 'input-countdown') {
      return !!(this.oldPassword() && this.newPassword() && this.confirmPassword() && this.captcha());
    }
    if (step === 'forgot') {
      return !!(this.captcha() && this.newPassword() && this.confirmPassword());
    }
    return false;
  });

  open(): void {
    this.visible.set(true);
    this.step.set('input');
    this.resetForm();
  }

  close(): void {
    this.visible.set(false);
    this.clearCountdown();
  }

  onBack(): void {
    this.step.set('input');
    this.resetForm();
  }

  goToForgot(): void {
    this.step.set('forgot');
    this.resetForm();
  }

  sendCaptcha(): void {
    if (this.countdown() > 0) return;
    this.countdown.set(60);
    if (this.step() === 'input') {
      this.step.set('input-countdown');
    }
    this.countdownTimer = setInterval(() => {
      this.countdown.update(v => {
        if (v <= 1) {
          this.clearCountdown();
          return 0;
        }
        return v - 1;
      });
    }, 1000);
  }

  submit(): void {
    if (!this.canSubmit()) return;
    this.step.set('confirm');
  }

  confirmChange(): void {
    this.step.set('success');
  }

  cancelConfirm(): void {
    this.step.set('input');
  }

  private clearCountdown(): void {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
      this.countdownTimer = null;
    }
  }

  private resetForm(): void {
    this.oldPassword.set('');
    this.newPassword.set('');
    this.confirmPassword.set('');
    this.captcha.set('');
    this.showOldPwd.set(false);
    this.showNewPwd.set(false);
    this.showConfirmPwd.set(false);
    this.clearCountdown();
  }
}
