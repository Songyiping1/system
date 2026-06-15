import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { TagModule } from 'primeng/tag';
import {
  RevealDirective,
  RevealStaggerDirective,
} from '../../shared/directives/reveal.directive';

/**
 * UI Kit 展示页 —— PrimeNG (Aura 预设) + 自定义 token 全局基线 +
 * motion 入场动画([appReveal] / [appRevealStagger])。
 */
@Component({
  selector: 'app-ui-kit',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    CheckboxModule,
    TagModule,
    RevealDirective,
    RevealStaggerDirective,
  ],
  styleUrl: './ui-kit.scss',
  template: `
    <div class="kit">
      <header class="kit__head" appReveal>
        <h1 class="kit__title">设计系统 · UI Kit</h1>
        <p class="kit__sub">PrimeNG (Aura) · 自定义 token · motion 动画驱动</p>
      </header>

      <!-- Button -->
      <section class="kit__section" appReveal [appRevealDelay]="0.05">
        <h2 class="kit__h2">Button</h2>

        <div class="kit__group">
          <span class="kit__tag">语义</span>
          <div class="kit__row" appRevealStagger>
            <p-button label="Primary" />
            <p-button label="Secondary" severity="secondary" />
            <p-button label="Success" severity="success" />
            <p-button label="Info" severity="info" />
            <p-button label="Warn" severity="warn" />
            <p-button label="Danger" severity="danger" />
            <p-button label="Contrast" severity="contrast" />
          </div>
        </div>

        <div class="kit__group">
          <span class="kit__tag">形态</span>
          <div class="kit__row">
            <p-button label="Outlined" [outlined]="true" />
            <p-button label="Text" [text]="true" />
            <p-button label="Raised" [raised]="true" />
            <p-button label="Rounded" [rounded]="true" />
            <p-button icon="pi pi-check" [rounded]="true" aria-label="确认" />
            <p-button label="Loading" [loading]="true" />
          </div>
        </div>

        <div class="kit__group">
          <span class="kit__tag">尺寸</span>
          <div class="kit__row kit__row--baseline">
            <p-button label="Small" size="small" />
            <p-button label="Normal" />
            <p-button label="Large" size="large" />
          </div>
        </div>
      </section>

      <!-- Form -->
      <section class="kit__section" appReveal [appRevealDelay]="0.1">
        <h2 class="kit__h2">Form</h2>
        <div class="kit__form" appRevealStagger [appRevealStaggerGap]="0.07">
          <div class="f">
            <label class="f__label" for="u">用户名</label>
            <input pInputText id="u" placeholder="请输入用户名" [(ngModel)]="username" />
          </div>
          <div class="f">
            <label class="f__label" for="e">邮箱</label>
            <input pInputText id="e" type="email" placeholder="name@example.com" [(ngModel)]="email" />
          </div>
          <div class="f">
            <label class="f__label" for="r">角色</label>
            <p-select
              inputId="r"
              [options]="roles"
              [(ngModel)]="role"
              optionLabel="name"
              placeholder="选择角色"
              styleClass="w-full"
            />
          </div>
          <div class="f f--inline">
            <p-checkbox inputId="a" [(ngModel)]="agree" [binary]="true" />
            <label for="a">我已阅读并同意协议</label>
          </div>
        </div>
        <p class="kit__echo">
          实时绑定:<code>{{ username() || '—' }}</code> ·
          <code>{{ role()?.name || '—' }}</code> ·
          <code>{{ agree() ? '已同意' : '未同意' }}</code>
        </p>
      </section>

      <!-- Tag + Tokens -->
      <section class="kit__section" appReveal [appRevealDelay]="0.15">
        <h2 class="kit__h2">Tag</h2>
        <div class="kit__row" appRevealStagger>
          <p-tag value="启用" severity="success" />
          <p-tag value="待审" severity="warn" />
          <p-tag value="停用" severity="danger" />
          <p-tag value="草稿" severity="secondary" />
          <p-tag value="新" severity="info" icon="pi pi-star" />
        </div>

        <h2 class="kit__h2" style="margin-top: var(--space-8)">语义色 Token</h2>
        <div class="kit__swatches" appRevealStagger [appRevealStaggerGap]="0.04">
          @for (s of swatches; track s.var) {
            <div class="swatch">
              <div class="swatch__chip" [style.background]="'var(' + s.var + ')'"></div>
              <span class="swatch__name">{{ s.name }}</span>
              <code class="swatch__var">{{ s.var }}</code>
            </div>
          }
        </div>
      </section>
    </div>
  `,
})
export class UiKit {
  protected readonly username = signal('');
  protected readonly email = signal('');
  protected readonly agree = signal(false);
  protected readonly role = signal<{ name: string; code: string } | null>(null);

  protected readonly roles = [
    { name: '管理员', code: 'admin' },
    { name: '运营', code: 'ops' },
    { name: '只读', code: 'viewer' },
  ];

  protected readonly swatches = [
    { name: '主色', var: '--primary' },
    { name: '主色浅底', var: '--primary-subtle' },
    { name: '成功', var: '--success' },
    { name: '警告', var: '--warning' },
    { name: '危险', var: '--danger' },
    { name: '信息', var: '--info' },
    { name: '表面', var: '--bg-surface' },
    { name: '画布', var: '--bg-canvas' },
    { name: '强文字', var: '--text-strong' },
    { name: '次文字', var: '--text-muted' },
    { name: '边框', var: '--border' },
    { name: '强边框', var: '--border-strong' },
  ];
}
