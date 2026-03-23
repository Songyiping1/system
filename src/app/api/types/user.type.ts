// src/app/api/types/user.type.ts

/** 登录请求参数 */
export interface LoginCommand {
  userName: string;
  password: string;
  action: 'login';
}

/** 登录响应 */
export interface LoginVo {
  isSuccess: boolean;
  userId: string;
  id: string;
  name: string;
  userName: string;
  cookieId: string;
  mobile: string;
  roles: string[];
  orgRole: string[];
  companyId: string;
  serverName: string;
}
