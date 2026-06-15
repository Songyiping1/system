const DEVICE_ID_KEY = 'authx_device_id';

/**
 * 设备标识 —— 后端登录要求 deviceId 必填(@NotBlank)。
 * 首次生成后持久化到 localStorage,保证同一浏览器稳定复用,
 * 便于后端做设备会话管理。
 */
export function getDeviceId(): string {
  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = generateId();
    localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}

/** 设备类型 —— Web 端固定标识 */
export const DEVICE_TYPE = 'WebBrowser';

/** 生成一个足够唯一的设备 id(优先用原生 crypto) */
function generateId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  // 回落:时间戳 + 随机
  return 'dev-' + Math.random().toString(36).slice(2) + '-' + new Date().getTime().toString(36);
}
