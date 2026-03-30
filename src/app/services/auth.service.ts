import { inject, Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { UserApiService, LoginVo } from '../api';

export type Role = 'admin' | 'user';

export interface User {
  userId: string;
  userName: string;
  name: string;
  role: Role;
  companyId: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private router = inject(Router);
  private userApi = inject(UserApiService);

  currentUser = signal<User | null>(null);
  isLoggedIn = computed(() => !!this.currentUser());
  isAdmin = computed(() => this.currentUser()?.role === 'admin');

  login(userName: string, password: string): Observable<LoginVo> {
    return this.userApi.login({ userName, password, action: 'login' }).pipe(
      tap((res) => {
        localStorage.setItem('cookieId', res.cookieId);
        this.currentUser.set({
          userId: res.userId,
          userName: res.name,
          name: res.name,
          role: res.roles?.includes('Root') ? 'admin' : 'user',
          companyId: res.companyId,
        });
      }),
    );
  }

  logout() {
    localStorage.removeItem('cookieId');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getHomePath(): string {
    return this.currentUser()?.role === 'admin' ? '/admin' : '/user';
    // return '/admin'
  }
}
