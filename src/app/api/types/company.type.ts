// src/app/api/types/company.type.ts
import { PictureEntry, TreeNode } from './common.type';

export interface CompanyUpsertCommand {
  id?: string;
  name?: string;
  aliasName?: string;
  logo?: PictureEntry;
  contactPhone?: string;
  type?: string;
  guide?: string;
  creditNo?: string;
}

export interface ApplyReviewCommand {
  id?: string;
  applyStatus?: number;
}

export interface CompanyMatchVo {
  companyName?: string;
  creditCode?: string;
}

export interface CompanyVo {
  id?: string;
  parentId?: string;
  order?: number;
  name?: string;
  aliasName?: string;
  linkDeptName?: string;
  applyStatus?: number;
  applyTime?: string;
  approvalTime?: string;
  contactPhone?: string;
  headCount?: number;
  logo?: PictureEntry;
  state?: number;
}

export type TreeNodeCompanyVo = TreeNode<CompanyVo>;
