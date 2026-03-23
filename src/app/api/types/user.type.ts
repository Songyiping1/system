// src/app/api/types/user.type.ts

/** 登录请求参数 */
export interface LoginCommand {
  userName: string;
  password: string;
  action: 'login';
}

/** 登录响应 */
export interface LoginVo {
  token: string;
  userId: string;
  userName: string;
  name: string;
  role: string;
}
