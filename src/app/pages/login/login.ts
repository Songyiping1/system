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
      const result = this.auth.login(this.username(), this.password());

      if (result.success) {
        this.router.navigate([this.auth.getHomePath()]);
      } else {
        this.errorMessage.set(result.message);
      }
    } else {
      console.log('验证码登录', this.username(), this.verifyCode());
    }
  }

  onSendCode() {
    console.log('发送验证码', this.username());
  }
}
