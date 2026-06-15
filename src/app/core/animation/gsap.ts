import { gsap } from 'gsap';

/**
 * GSAP 封装 —— 负责「编排级」复杂动画(时间线、多元素协同、序列)。
 *
 * 分工:
 *   - Motion(motion.ts):常规单元素交互(入场、hover、列表 stagger)
 *   - GSAP(本文件):需要精确时间线编排的复杂场景(登录页演出、引导序列、
 *     多元素错峰协同),这是 GSAP 的强项
 *
 * 统一默认缓动,保证全站手感一致。
 */

/** 全站统一缓动名(GSAP 内置) */
export const GSAP_EASE = 'power3.out';

/**
 * 新建一条时间线,带全站默认值。
 * @param defaults 覆盖默认 ease/duration
 */
export function timeline(defaults?: gsap.TweenVars): gsap.core.Timeline {
  return gsap.timeline({
    defaults: { ease: GSAP_EASE, duration: 0.5, ...defaults },
  });
}

/**
 * 一组元素错峰浮入 —— 时间线版的 stagger,可链式接更多动作。
 * @param targets 选择器或元素集合
 * @param stagger 每项间隔(秒)
 */
export function revealSequence(
  targets: gsap.TweenTarget,
  stagger = 0.08,
): gsap.core.Timeline {
  return timeline().from(targets, {
    opacity: 0,
    y: 20,
    stagger,
  });
}

/** 直接暴露 gsap 实例,供需要完全控制的场景使用 */
export { gsap };
