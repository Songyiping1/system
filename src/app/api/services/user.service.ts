// src/app/api/services/user.service.ts
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../request/http.service';
import { LoginCommand, LoginVo } from '../types';

@Injectable({ providedIn: 'root' })
export class UserApiService {
  private http = inject(HttpService);

  /** 用户登录 */
  login(body: LoginCommand): Observable<LoginVo> {
    return this.http.post<LoginVo>('/User/login', body);
  }
}
