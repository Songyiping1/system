import { animate, inView } from 'motion';

/**
 * Motion 预设 —— 负责「常规单元素交互」(入场、hover、列表 stagger)。
 *
 * 分工:
 *   - Motion(本文件):页面/组件级的入场、错峰、轻交互,基于 WAAPI,零运行时开销
 *   - GSAP(gsap.ts):需要精确时间线编排的复杂演出(登录页、引导序列)
 *
 * 所有时长/缓动统一走这里的 token,不在业务里散落魔法值。
 * 与 gsap.ts 的 power3.out 手感对齐(强 ease-out 收尾)。
 */

/** 全站统一动效时长(秒) */
export const DUR = {
  fast: 0.18,
  base: 0.32,
  slow: 0.5,
} as const;

/** 强 ease-out —— 入场收尾干脆,贴近 GSAP power3.out */
export const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** 弹性回弹 —— hover/点击反馈,略微过冲 */
export const EASE_SPRING: [number, number, number, number] = [0.34, 1.56, 0.64, 1];

/** 是否开启了「减少动态效果」无障碍偏好 */
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/** 入场动画通用参数 */
export interface RevealOptions {
  /** 起始位移(px),默认 16 */
  y?: number;
  /** 延迟(秒),默认 0 */
  delay?: number;
  /** 时长(秒),默认 DUR.base */
  duration?: number;
}

type AnimateControls = ReturnType<typeof animate>;

/** 把单个元素恢复到「可见」最终态(reduced-motion 兜底) */
function settle(el: Element): void {
  const node = el as HTMLElement;
  node.style.opacity = '';
  node.style.transform = '';
}

/**
 * 淡入上浮 —— 最常用的入场。
 * reduced-motion 下直接落到可见态,绝不卡在隐身。
 */
export function fadeUp(el: Element, opts: RevealOptions = {}): AnimateControls | void {
  if (prefersReducedMotion()) {
    settle(el);
    return;
  }
  const { y = 16, delay = 0, duration = DUR.base } = opts;
  return animate(
    el,
    { opacity: [0, 1], transform: [`translateY(${y}px)`, 'translateY(0px)'] },
    { duration, delay, ease: EASE_OUT },
  );
}

/** 错峰入场参数 */
export interface StaggerOptions extends RevealOptions {
  /** 每项间隔(秒),默认 0.06 */
  gap?: number;
}

/**
 * 一组元素错峰浮入 —— motion 无单独 stagger 导出,这里用计算延迟实现。
 * @param elements 元素集合(数组 / NodeList / HTMLCollection)
 */
export function revealStagger(
  elements: ArrayLike<Element>,
  opts: StaggerOptions = {},
): void {
  const { gap = 0.06, delay = 0, y, duration } = opts;
  const items = Array.from(elements);
  if (prefersReducedMotion()) {
    items.forEach(settle);
    return;
  }
  items.forEach((el, i) => fadeUp(el, { delay: delay + i * gap, y, duration }));
}

/**
 * 进入视口即播放回调(只触发一次)。
 * 用于滚动区域的「随滚随现」。返回手动停止函数。
 */
export function revealOnView(
  el: Element,
  onEnter: (el: Element) => void,
  amount: number | 'some' | 'all' = 0.15,
): VoidFunction {
  if (prefersReducedMotion()) {
    settle(el);
    onEnter(el);
    return () => {};
  }
  let stop: VoidFunction = () => {};
  stop = inView(
    el,
    (target) => {
      onEnter(target);
      stop();
    },
    { amount },
  );
  return stop;
}

/** 直接暴露 motion 原语,供需要完全控制的场景使用 */
export { animate, inView };
