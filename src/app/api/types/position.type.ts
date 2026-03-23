// src/app/api/types/position.type.ts
import { RoleVo } from './role.type';

export interface PositionUpsertCommand {
  id?: string;
  name?: string;
  companyId?: string;
  deptId?: string;
  status?: number;
  roleIds?: string[];
}

export interface PositionVo {
  id?: string;
  name?: string;
  userId?: string;
  deptId?: string;
  deptName?: string;
  roleList?: RoleVo[];
}
