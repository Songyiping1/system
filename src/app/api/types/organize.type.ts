// src/app/api/types/organize.type.ts
import { TreeNode } from './common.type';

export interface OrganizeUpsertCommand {
  id?: string;
  name?: string;
  companyId?: string;
  parentId?: string;
  parentUri?: string;
  status?: number;
}

export interface OrganizeRemoveCommand {
  id?: string;
  companyId?: string;
}

export interface Organize {
  id?: string;
  parentId?: string;
  order?: number;
  name?: string;
  companyId?: string;
  type?: string;
  state?: number;
  uri?: string;
}

export type TreeNodeOrganize = TreeNode<Organize>;

export interface OrganizeBindCommand {
  companyId?: string;
  userName?: string;
  mobile?: string;
  sex?: number;
  deptId?: string;
  orgId?: string;
  userId?: string;
  state?: number;
}

export interface RemoveUser {
  userId?: string;
  deptId?: string;
  orgId?: string;
}

export interface OrganizeUserRemoveCommand {
  companyId?: string;
  userList?: RemoveUser[];
}

export interface OrganizeUserTransferCommand {
  companyId?: string;
  oldDeptId?: string;
  deptId?: string;
  userId?: string;
}

export interface ModuleManagerCommand {
  userId?: string;
  userName?: string;
  companyId?: string;
  dataIds?: number[];
}

export interface OrganizeUserVo {
  companyId?: string;
  deptId?: string;
  deptName?: string;
  userId?: string;
  userName?: string;
  name?: string;
  mobile?: string;
  state?: number;
  uri?: string;
  orgId?: string;
  orgName?: string;
}

export interface PermissionLogQuery {
  companyId?: string;
  userId?: string;
  startTime?: string;
  endTime?: string;
}

export interface PermissionLogVo {
  type?: string;
  operateUserName?: string;
  description?: string;
  createTime?: string;
}
