import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { PasswordDialogStep } from '../../shared/models';

@Component({
  selector: 'app-change-password',
  imports: [FormsModule, DialogComponent, ButtonComponent],
  templateUrl: './change-password.html',
  styleUrl: './change-password.scss',
})
export class ChangePassword {
  readonly visible = signal(false);
  readonly step = signal<PasswordDialogStep>('input');
  readonly form = signal({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
    captcha: '',
    phone: '',
    newPhone: '',
  });
  readonly errors = signal<Record<string, string>>({});
  readonly countdown = signal(0);
  readonly companyName = signal('中企云链（北京）信息科技有限公司');

  readonly showOldPassword = signal(false);
  readonly showNewPassword = signal(false);
  readonly showConfirmPassword = signal(false);

  private countdownTimer: ReturnType<typeof setInterval> | null = null;

  readonly dialogTitle = computed(() => {
    const s = this.step();
    if (s === 'confirm' || s === 'success') return '提示';
    if (s === 'forgot' || s === 'forgot-error') return '忘记密码';
    if (s === 'modify-binding') return '修改绑定';
    return '修改密码';
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

  updateField(field: string, value: string): void {
    this.form.update(f => ({ ...f, [field]: value }));
    this.errors.update(e => {
      const copy = { ...e };
      delete copy[field];
      return copy;
    });
  }

  submitPassword(): void {
    const f = this.form();
    const errs: Record<string, string> = {};
    if (!f.oldPassword) errs['oldPassword'] = '请输入原密码';
    if (!f.newPassword) errs['newPassword'] = '请输入新密码';
    if (f.newPassword && f.newPassword.length < 8) errs['newPassword'] = '密码长度不能少于8位';
    if (!f.confirmPassword) errs['confirmPassword'] = '请确认新密码';
    if (f.newPassword && f.confirmPassword && f.newPassword !== f.confirmPassword) errs['confirmPassword'] = '两次密码输入不一致';

    this.errors.set(errs);
    if (Object.keys(errs).length === 0) {
      this.step.set('confirm');
    }
  }

  confirmChange(): void {
    this.step.set('success');
  }

  goToForgot(): void {
    this.step.set('forgot');
  }

  goToModifyBinding(): void {
    this.step.set('modify-binding');
  }

  backToInput(): void {
    this.step.set('input');
    this.resetForm();
  }

  sendCaptcha(): void {
    if (this.countdown() > 0) return;
    this.countdown.set(60);
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

  private clearCountdown(): void {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
      this.countdownTimer = null;
    }
  }

  private resetForm(): void {
    this.form.set({
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      captcha: '',
      phone: '',
      newPhone: '',
    });
    this.errors.set({});
    this.showOldPassword.set(false);
    this.showNewPassword.set(false);
    this.showConfirmPassword.set(false);
  }
}
