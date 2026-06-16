import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  input,
  model,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';

export interface Command {
  id: string;
  label: string;
  icon: string;
  hint?: string;
  action: () => void;
}

/**
 * 命令面板(⌘K)—— 搜索页面与操作,纯键盘可达。
 * open 由外部(壳)控制;commands 由壳注入(导航 + 主题等)。
 */
@Component({
  selector: 'app-command-palette',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, DialogModule],
  styleUrl: './command-palette.scss',
  template: `
    <p-dialog
      [visible]="open()"
      (visibleChange)="open.set($event)"
      [modal]="true"
      [dismissableMask]="true"
      [showHeader]="false"
      [draggable]="false"
      [resizable]="false"
      position="top"
      styleClass="cmdk-dialog"
      [style]="{ width: '34rem', maxWidth: '92vw' }"
      (onShow)="onShow()"
    >
      <div class="cmdk">
        <div class="cmdk__search">
          <i class="pi pi-search"></i>
          <input
            #box
            type="text"
            placeholder="搜索页面、操作…"
            [ngModel]="query()"
            (ngModelChange)="onQuery($event)"
            (keydown)="onKey($event)"
          />
          <kbd>ESC</kbd>
        </div>

        <ul class="cmdk__list">
          @for (cmd of filtered(); track cmd.id; let i = $index) {
            <li
              class="cmdk__item"
              [class.is-active]="i === activeIndex()"
              (mouseenter)="activeIndex.set(i)"
              (click)="run(cmd)"
            >
              <i [class]="cmd.icon"></i>
              <span class="cmdk__label">{{ cmd.label }}</span>
              @if (cmd.hint) {
                <small>{{ cmd.hint }}</small>
              }
            </li>
          } @empty {
            <li class="cmdk__empty">没有匹配的页面或操作</li>
          }
        </ul>
      </div>
    </p-dialog>
  `,
})
export class CommandPalette {
  readonly open = model(false);
  readonly commands = input<Command[]>([]);

  protected readonly query = signal('');
  protected readonly activeIndex = signal(0);
  private readonly box = viewChild<ElementRef<HTMLInputElement>>('box');

  protected readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    const list = this.commands();
    if (!q) return list;
    return list.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        (c.hint?.toLowerCase().includes(q) ?? false),
    );
  });

  protected onShow(): void {
    this.query.set('');
    this.activeIndex.set(0);
    setTimeout(() => this.box()?.nativeElement.focus(), 40);
  }

  protected onQuery(value: string): void {
    this.query.set(value);
    this.activeIndex.set(0);
  }

  protected onKey(event: KeyboardEvent): void {
    const items = this.filtered();
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.activeIndex.update((i) => Math.min(i + 1, items.length - 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.activeIndex.update((i) => Math.max(i - 1, 0));
        break;
      case 'Enter': {
        event.preventDefault();
        const cmd = items[this.activeIndex()];
        if (cmd) this.run(cmd);
        break;
      }
      case 'Escape':
        this.open.set(false);
        break;
    }
  }

  protected run(cmd: Command): void {
    this.open.set(false);
    cmd.action();
  }
}
