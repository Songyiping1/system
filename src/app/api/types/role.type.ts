// src/app/api/types/role.type.ts

export interface RoleUpsertCommand {
  id?: string;
  name?: string;
  companyId?: string;
  description?: string;
  type?: string;
  groupId?: string;
}

export interface RoleBindMenuCommand {
  companyId?: string;
  roleIds?: string[];
  menuIds?: string[];
}

export interface RoleBindUserCommand {
  roleId?: string;
  userIds?: string[];
}

export interface RoleVo {
  id?: string;
  name?: string;
  groupId?: string;
  type?: string;
  positionId?: string;
  description?: string;
  permissionIds?: string[];
  userIds?: string[];
  children?: RoleVo[];
}

export interface RoleMenuVo {
  id?: string;
  roleNames?: string[];
}

export interface Role {
  id?: string;
  name?: string;
  companyId?: string;
  sourceType?: string;
  description?: string;
  type?: string;
  groupId?: string;
  createAt?: string;
}
