// src/app/api/types/common.type.ts

/** 后端统一响应格式 */
export interface ApiResponse<T> {
  isSuccess: boolean;
  items: T;
  serverName?: string;
}

export interface PictureEntry {
  ossType?: string;
  bucket?: string;
  contentType?: string;
  title?: string;
  uri?: string;
}

export interface UserVo {
  userId?: string;
  userName?: string;
  name?: string;
}

export type TreeNode<T> = T & {
  children?: TreeNode<T>[];
};

export interface ImportResultVo {
  success?: number;
  fail?: number;
}

export interface BizDict {
  id?: number;
  dictType?: string;
  dictCode?: string;
  dictValue?: string;
}
