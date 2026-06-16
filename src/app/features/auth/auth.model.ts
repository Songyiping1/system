/** 平台管理员登录请求体 —— 对齐 pass-authx PlatformAdminLoginRequestDTO */
export interface PlatformAdminLoginRequest {
  /** 可传用户名或手机号。 */
  account: string;
  password: string;
}

/** 平台管理员登录返回 —— 对齐 pass-authx PlatformAdminLoginResult */
export interface PlatformAdminLoginResult {
  platformAdminId: string;
  username: string;
  mobile?: string;
  displayName?: string;
  accessToken: string;
  accessTokenExpiresIn: number;
}

/** 平台管理员本地会话资料。后端当前只返回 access token。 */
export interface PlatformAdminProfile {
  id: string;
  username: string;
  mobile?: string;
  displayName?: string;
  accessTokenExpiresIn?: number;
}

export function toPlatformAdminProfile(result: PlatformAdminLoginResult): PlatformAdminProfile {
  return {
    id: result.platformAdminId,
    username: result.username,
    mobile: result.mobile,
    displayName: result.displayName,
    accessTokenExpiresIn: result.accessTokenExpiresIn,
  };
}
