import {
  AfterViewInit,
  Directive,
  ElementRef,
  OnDestroy,
  inject,
  input,
} from '@angular/core';
import {
  fadeUp,
  prefersReducedMotion,
  revealOnView,
  revealStagger,
} from '../../core/animation/motion';

/**
 * [appReveal] —— 元素进入视口时淡入上浮一次,让任意页面「活起来」。
 *
 * 用法:
 *   <div appReveal>...</div>
 *   <div appReveal [appRevealDelay]="0.1" [appRevealY]="24">...</div>
 *
 * 进入前先把元素压到隐身(避免闪现),reduced-motion 下直接保持可见。
 */
@Directive({
  selector: '[appReveal]',
  standalone: true,
})
export class RevealDirective implements AfterViewInit, OnDestroy {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  /** 延迟(秒) */
  readonly delay = input(0, { alias: 'appRevealDelay' });
  /** 起始位移(px) */
  readonly y = input(16, { alias: 'appRevealY' });

  private stop?: VoidFunction;

  ngAfterViewInit(): void {
    const node = this.host.nativeElement;
    if (prefersReducedMotion()) return;

    // 先压到隐身,等进入视口再淡入,避免首帧闪现。
    node.style.opacity = '0';
    this.stop = revealOnView(node, (el) =>
      fadeUp(el, { delay: this.delay(), y: this.y() }),
    );
  }

  ngOnDestroy(): void {
    this.stop?.();
  }
}

/**
 * [appRevealStagger] —— 容器级:对直接子元素错峰入场。
 *
 * 用法:
 *   <ul appRevealStagger>
 *     <li>...</li>
 *   </ul>
 *   <ul appRevealStagger [appRevealStaggerGap]="0.08" [appRevealStaggerDelay]="0.1">
 */
@Directive({
  selector: '[appRevealStagger]',
  standalone: true,
})
export class RevealStaggerDirective implements AfterViewInit, OnDestroy {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  /** 每项间隔(秒) */
  readonly gap = input(0.06, { alias: 'appRevealStaggerGap' });
  /** 整体起始延迟(秒) */
  readonly delay = input(0, { alias: 'appRevealStaggerDelay' });
  /** 子元素起始位移(px) */
  readonly y = input(16, { alias: 'appRevealStaggerY' });

  private stop?: VoidFunction;

  ngAfterViewInit(): void {
    const node = this.host.nativeElement;
    const children = node.children;
    if (children.length === 0) return;
    if (prefersReducedMotion()) return;

    Array.from(children).forEach((child) => {
      (child as HTMLElement).style.opacity = '0';
    });

    this.stop = revealOnView(node, () =>
      revealStagger(children, { gap: this.gap(), delay: this.delay(), y: this.y() }),
    );
  }

  ngOnDestroy(): void {
    this.stop?.();
  }
}
