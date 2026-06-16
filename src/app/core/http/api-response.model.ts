/**
 * pass-authx 统一返回壳。
 *
 * 后端 107 个接口已全部套上 R<> 包装,成功响应形如:
 *   { isSuccess: true,  serverName: "...", code: 200, message: "成功", data: {...} }
 * 失败响应形如:
 *   { isSuccess: false, serverName: "...", code: 40001, message: "xxx" }   // 无 data
 *
 * 注意:paas 的 ResponseWrapperSerializer 会把对象字段平铺到顶层,
 * 但 R<> 包装的 org 域接口保留 data 字段;裸 VO 接口会平铺。
 * 我们以 data 字段为准拆壳,平铺场景由具体 service 处理。
 */
export interface ApiResponse<T = unknown> {
  /** 业务是否成功。拆壳依据。 */
  isSuccess?: boolean;
  /** 业务码。200 成功;其余为各业务错误码。 */
  code: number;
  /** 提示文案。失败时用于错误展示。 */
  message: string;
  /** 业务数据。成功时存在。 */
  data?: T;
  /** 服务名,paas 注入,前端一般不关心。 */
  serverName?: string;
}

/**
 * 业务异常:isSuccess=false 时,interceptor 抛出此类型。
 * 全局错误处理 / 组件 catch 时可读取 code + message 做精细处理。
 */
export class ApiError extends Error {
  constructor(
    /** 业务码 */
    readonly code: number,
    /** 提示文案 */
    override readonly message: string,
    /** HTTP 状态码(若有) */
    readonly httpStatus?: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * HTTP 状态码 → 用户可读兜底文案。
 * 仅用于「非业务壳」的传输层错误(网络断 / 网关 / 404 / 500 等),
 * 业务失败优先用后端返回壳里的 message。
 */
export function httpStatusMessage(status: number): string {
  switch (status) {
    case 0:
      return '网络连接失败,请检查网络后重试';
    case 400:
      return '请求参数有误';
    case 401:
      return '登录已过期,请重新登录';
    case 403:
      return '没有权限访问该资源';
    case 404:
      return '请求的资源不存在';
    case 408:
      return '请求超时,请稍后重试';
    case 409:
      return '操作冲突,请刷新后重试';
    case 422:
      return '提交的数据未通过校验';
    case 429:
      return '操作过于频繁,请稍后再试';
    case 500:
      return '服务器开小差了,请稍后重试';
    case 502:
      return '网关错误,请稍后重试';
    case 503:
      return '服务暂不可用,请稍后重试';
    case 504:
      return '网关超时,请稍后重试';
    default:
      if (status >= 500) return '服务异常,请稍后重试';
      if (status >= 400) return '请求失败,请稍后重试';
      return '请求失败,请稍后重试';
  }
}

/** 判断一个响应体是否符合 pass-authx 返回壳形状。 */
export function isApiResponse(body: unknown): body is ApiResponse {
  if (typeof body !== 'object' || body === null) return false;

  const candidate = body as ApiResponse;
  const hasWrappedFlag =
    'isSuccess' in candidate && typeof candidate.isSuccess === 'boolean';
  const hasAuthxShell =
    'code' in candidate &&
    typeof candidate.code === 'number' &&
    'message' in candidate &&
    typeof candidate.message === 'string';

  return hasWrappedFlag || hasAuthxShell;
}
