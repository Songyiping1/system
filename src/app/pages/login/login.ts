import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  activeTab = signal<'password' | 'code'>('password');
  username = signal('');
  password = signal('');
  verifyCode = signal('');
  usernameFocused = signal(false);
  decorationSizes = [241, 297, 356, 414];

  onLogin() {
    if (this.activeTab() === 'password') {
      console.log('账号密码登录', this.username(), this.password());
    } else {
      console.log('验证码登录', this.username(), this.verifyCode());
    }
  }

  onSendCode() {
    console.log('发送验证码', this.username());
  }
}
