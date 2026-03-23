// src/app/api/types/menu.type.ts
import { PictureEntry, TreeNode } from './common.type';

export interface MenuUpsertCommand {
  id?: string;
  name?: string;
  description?: string;
  code?: string;
  parentId?: string;
  parentPath?: string;
  icon?: PictureEntry;
  menuType?: string;
  route?: string;
  status?: number;
  position?: string;
}

export interface MenuAssignCommand {
  companyId?: string;
  menuIds?: string[];
}

export interface MenuDragCommand {
  id?: string;
  code?: string;
  parentId?: string;
  parentPath?: string;
  preOrder?: number;
}

export interface Menu {
  id?: string;
  parentId?: string;
  order?: number;
  name?: string;
  code?: string;
  menuType?: string;
  path?: string;
  icon?: PictureEntry;
  route?: string;
  description?: string;
  status?: number;
  position?: string;
}

export type TreeNodeMenu = TreeNode<Menu>;

export interface PermissionOrigin {
  type?: string;
  name?: string;
  roleOrigin?: string;
}

export interface AuthMenuVo {
  id?: string;
  parentId?: string;
  order?: number;
  name?: string;
  route?: string;
  description?: string;
  added?: boolean;
  origins?: PermissionOrigin[];
}

export type TreeNodeAuthMenuVo = TreeNode<AuthMenuVo>;

export interface AuthDiffVo {
  fromAuthMenu?: TreeNodeAuthMenuVo[];
  toAuthMenu?: TreeNodeAuthMenuVo[];
}
