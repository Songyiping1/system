import { inject, Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';

export type Role = 'admin' | 'user';

export interface User {
  username: string;
  role: Role;
  name: string;
}

interface MockAccount {
  username: string;
  password: string;
  role: Role;
  name: string;
}

const MOCK_ACCOUNTS: MockAccount[] = [
  { username: 'admin', password: 'admin123', role: 'admin', name: '管理员' },
  { username: 'user', password: 'user123', role: 'user', name: '普通用户' },
];

@Injectable({ providedIn: 'root' })
export class AuthService {
  private router = inject(Router);

  currentUser = signal<User | null>(null);
  isLoggedIn = computed(() => !!this.currentUser());
  isAdmin = computed(() => this.currentUser()?.role === 'admin');

  login(username: string, password: string): { success: boolean; message: string } {
    const account = MOCK_ACCOUNTS.find(
      (a) => a.username === username && a.password === password
    );

    if (!account) {
      return { success: false, message: '账号或密码错误' };
    }

    this.currentUser.set({
      username: account.username,
      role: account.role,
      name: account.name,
    });

    return { success: true, message: '登录成功' };
  }

  logout() {
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getHomePath(): string {
    return this.currentUser()?.role === 'admin' ? '/admin' : '/user';
  }
}
