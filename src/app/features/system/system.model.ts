import { PageRequest } from '../../shared/models/page-result';

export type UserState = 'active' | 'disabled' | 'archived' | 'deleted' | string;
export type ApplyState = 'pending' | 'approved' | 'rejected' | 'cancelled' | string;

export interface SystemUserQuery extends PageRequest {
  keyword?: string;
  state?: string;
}

export interface SystemUser {
  id: string;
  username?: string;
  realName?: string;
  mobile?: string;
  email?: string;
  avatarUrl?: string;
  accountType?: string;
  state: UserState;
  defaultCompanyId?: string;
  createdAt?: number;
  updatedAt?: number;
}

export interface SystemUserCompany {
  companyId: string;
  companyName?: string;
  companyState?: string;
  memberId?: string;
  memberDisplayName?: string;
  memberState?: string;
  joinedAt?: number;
}

export interface UserSession {
  sessionId: string;
  deviceId?: string;
  deviceType?: string;
  loginMethod?: string;
  state?: string;
  ipAddress?: string;
  createdAt?: number;
  lastSeenAt?: number;
  expiresAt?: number;
  current?: boolean;
}

export interface SystemUserDetail {
  user: SystemUser;
  companies: SystemUserCompany[];
  sessions: UserSession[];
}

export interface SystemUserStateUpdate {
  state: 'active' | 'disabled' | 'archived';
}

export interface CompanyApplyQuery extends PageRequest {
  state?: string;
}

export interface CompanyApply {
  id: string;
  applicantUserId?: string;
  companyName?: string;
  contactName?: string;
  contactMobile?: string;
  ownerMobile?: string;
  state: ApplyState;
  reviewedBy?: string;
  reviewedAt?: number;
  reviewReason?: string;
  approvedCompanyId?: string;
  approvedMemberId?: string;
  createdAt?: number;
  updatedAt?: number;
  cancelledAt?: number;
}

export interface CompanyApplyReviewRequest {
  reason?: string;
}

export interface SelectOption {
  label: string;
  value: string;
}

export const USER_STATE_OPTIONS: SelectOption[] = [
  { label: '全部状态', value: '' },
  { label: '正常', value: 'active' },
  { label: '禁用', value: 'disabled' },
  { label: '注销', value: 'archived' },
  { label: '删除', value: 'deleted' },
];

export const APPLY_STATE_OPTIONS: SelectOption[] = [
  { label: '全部状态', value: '' },
  { label: '待审核', value: 'pending' },
  { label: '已通过', value: 'approved' },
  { label: '已拒绝', value: 'rejected' },
  { label: '已撤销', value: 'cancelled' },
];
