/** 密码登录请求体 —— 对齐 pass-authx LoginRequestDTO */
export interface PasswordLoginRequest {
  mobile: string;
  password: string;
  deviceId: string;
  deviceType: string;
}

/** 登录返回 —— 对齐 pass-authx LoginResult(含父类 AuthenticatedTokenResult) */
export interface LoginResult {
  /** 登录流程阶段:authenticated 正常完成 / bind_mobile 需补绑手机等 */
  flowStage: string;
  userId: string;
  accountType: string;
  accessToken: string;
  accessTokenExpiresIn: number;
  refreshToken: string;
  refreshTokenExpiresIn: number;
  /** 当前会话绑定的公司 id */
  activeCompanyId: string;
  /** 当前会话绑定的组织节点 id */
  activeOrgId: string;
}

/** 当前登录用户基础资料 —— 对齐 pass-authx CurrentUserResult(取常用字段) */
export interface CurrentUserResult {
  id: string;
  username: string;
  mobile?: string;
  email?: string;
  avatarUrl?: string;
  accountType?: string;
  state?: string;
  defaultCompanyId?: string;
  defaultOrgId?: string;
}

/** 公司工作空间 —— 对齐 pass-authx CompanyWorkspaceResult(取常用字段) */
export interface CompanyWorkspaceResult {
  id: string;
  name: string;
  aliasName?: string;
  logoUrl?: string;
  state?: string;
  ownerMemberId?: string;
  memberId?: string;
  memberState?: string;
  deptId?: string;
  manageable?: boolean;
  current?: boolean;
}

/** 菜单/权限树节点 —— 对齐 pass-authx PermissionNodeTreeResult(取菜单相关字段) */
export interface PermissionNode {
  id: string;
  permissionDefinitionId?: string;
  parentId?: string;
  code?: string;
  name: string;
  nodeType?: string;
  route?: string;
  component?: string;
  icon?: string;
  sortNo?: number;
  visible?: boolean;
  children?: PermissionNode[];
}

/** 登录环境 —— 对齐 pass-authx AuthEnvironmentResult(取前端需要的字段) */
export interface AuthEnvironmentResult {
  user: CurrentUserResult;
  authSessionId?: string;
  activeCompanyId?: string;
  activeOrgId?: string;
  currentCompany?: CompanyWorkspaceResult;
  companies?: CompanyWorkspaceResult[];
  menus?: PermissionNode[];
  ossBucketPrefix?: string;
}
