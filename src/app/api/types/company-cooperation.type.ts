// src/app/api/types/company-cooperation.type.ts

export interface CooperationApplyCommand {
  companyId?: string;
  parentId?: string;
  linkDeptId?: string;
  status?: number;
  applyTime?: string;
}

export interface CooperationApplyReviewCommand {
  parentId?: string;
  companyId?: string;
  status?: number;
}

export interface CooperationDetailVo {
  parentCompanyCount?: number;
  childCompanyCount?: number;
  headCount?: number;
  childCompanyHeadCount?: number;
}

export interface CooperationApplyVo {
  parentId?: string;
  companyId?: string;
  companyName?: string;
  headCount?: number;
  status?: number;
  applyTime?: string;
  reviewTime?: string;
}
