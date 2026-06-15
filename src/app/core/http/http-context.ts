import { HttpContextToken } from '@angular/common/http';

/**
 * 逃生舱标记:置 true 时,拆壳 interceptor 跳过拆壳,
 * 把完整的 { isSuccess, code, message, data } 壳透传给调用方。
 *
 * 用于少数需要根据业务 code 做分支的接口。用法:
 *   http.get(url, { context: new HttpContext().set(RAW_RESPONSE, true) })
 */
export const RAW_RESPONSE = new HttpContextToken<boolean>(() => false);

/**
 * 标记:置 true 时,跳过自动注入 Bearer token(用于登录、注册等匿名接口)。
 *   http.post(url, body, { context: new HttpContext().set(SKIP_AUTH, true) })
 */
export const SKIP_AUTH = new HttpContextToken<boolean>(() => false);

/**
 * 标记:置 true 时,errorInterceptor 不弹全局 Toast。
 * 用于由调用方自行处理错误展示的接口(如登录页内联报错、token 刷新)。
 */
export const SKIP_ERROR_TOAST = new HttpContextToken<boolean>(() => false);

/**
 * 标记:置 true 时,不计入全局加载进度条。
 * 用于轮询/SSE/后台静默请求(如 token 刷新)。
 */
export const SKIP_LOADING = new HttpContextToken<boolean>(() => false);
