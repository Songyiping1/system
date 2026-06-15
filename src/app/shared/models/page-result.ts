/**
 * 分页结果 —— 对齐 pass-authx 的 PageResult<T>。
 * org 域大量列表接口(成员/角色/职位…)统一返回该形状。
 */
export interface PageResult<T> {
  /** 当前页码(从 1 开始) */
  page: number;
  /** 每页条数 */
  size: number;
  /** 总条数 */
  total: number;
  /** 当前页数据 */
  items: T[];
}

/** 分页请求基类 —— 列表接口通用入参 */
export interface PageRequest {
  page: number;
  size: number;
}

/** 默认分页参数 */
export const DEFAULT_PAGE: PageRequest = { page: 1, size: 20 };

/** 空分页结果(初始态占位) */
export function emptyPage<T>(size = DEFAULT_PAGE.size): PageResult<T> {
  return { page: 1, size, total: 0, items: [] };
}
