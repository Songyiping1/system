import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  activeTab = signal<'password' | 'code'>('password');
  username = signal('admin');
  password = signal('admin123');
  verifyCode = signal('');
  usernameFocused = signal(false);
  errorMessage = signal('');
  decorationSizes = [241, 297, 356, 414];

  onLogin() {
    this.errorMessage.set('');

    if (this.activeTab() === 'password') {
      this.auth.login(this.username(), this.password()).subscribe({
        next: () => {
          this.router.navigate([this.auth.getHomePath()]);
        },
        error: () => {
          this.errorMessage.set('账号或密码错误');
        },
      });
    } else {
      console.log('验证码登录', this.username(), this.verifyCode());
    }
  }

  onSendCode() {
    console.log('发送验证码', this.username());
  }
}
