// src/app/api/types/common.type.ts

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

export interface TreeNode<T> {
  data?: T;
  children?: TreeNode<T>[];
}

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
