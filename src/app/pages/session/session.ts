import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { AuthStore } from '../../core/auth/auth.store';
import { TokenStorage } from '../../core/auth/token.storage';
import {
  RevealDirective,
  RevealStaggerDirective,
} from '../../shared/directives/reveal.directive';
import { AuthService } from '../../features/auth/auth.service';

@Component({
  selector: 'app-session',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonModule, TagModule, RevealDirective, RevealStaggerDirective],
  styleUrl: './session.scss',
  template: `
    <main class="session" appReveal>
      <header class="session__head">
        <div>
          <span class="eyebrow">工作区已准备</span>
          <h1>{{ store.displayName() || '登录完成' }}</h1>
          <p>{{ currentCompanyName() }}</p>
        </div>

        <div class="session__actions">
          <p-button
            label="刷新状态"
            icon="pi pi-refresh"
            severity="secondary"
            [outlined]="true"
            (onClick)="hydrate()"
          />
          <p-button
            label="退出登录"
            icon="pi pi-sign-out"
            severity="danger"
            [outlined]="true"
            (onClick)="logout()"
          />
        </div>
      </header>

      <section class="session-grid" appRevealStagger [appRevealStaggerGap]="0.05">
        <article class="stat">
          <span>当前工作区</span>
          <strong>{{ store.currentCompany()?.name || '未选择' }}</strong>
          <p-tag [value]="store.activeCompanyId() ? '已选择' : '未选择'" severity="info" />
        </article>

        <article class="stat">
          <span>可进入空间</span>
          <strong>{{ store.companies().length }}</strong>
          <small>你可切换的工作区</small>
        </article>

        <article class="stat">
          <span>可用功能</span>
          <strong>{{ store.menus().length }}</strong>
          <small>根据账号自动显示</small>
        </article>
      </section>

      <section class="session-panel" appReveal [appRevealDelay]="0.08">
        <div class="session-panel__title">
          <span class="eyebrow">系统功能</span>
          <h2>你可以使用的功能</h2>
        </div>

        @if (store.menus().length > 0) {
          <div class="menu-list">
            @for (menu of store.menus(); track menu.id) {
              <div class="menu-item">
                <span class="menu-item__icon">{{ menu.icon || 'M' }}</span>
                <div>
                  <strong>{{ menu.name }}</strong>
                  <small>{{ nodeTypeLabel(menu.nodeType) }}</small>
                </div>
                <p-tag [value]="nodeTypeLabel(menu.nodeType)" severity="secondary" />
              </div>
            }
          </div>
        } @else {
          <div class="empty">
            <span class="empty__glyph">—</span>
            <strong>暂无可用功能</strong>
            <p>管理员配置后会显示在这里。</p>
          </div>
        }
      </section>
    </main>
  `,
})
export class SessionPage {
  protected readonly store = inject(AuthStore);
  protected readonly currentCompanyName = computed(
    () => this.store.currentCompany()?.name || '当前会话没有绑定公司',
  );

  private readonly auth = inject(AuthService);
  private readonly tokenStorage = inject(TokenStorage);
  private readonly router = inject(Router);

  hydrate(): void {
    this.store.hydrate().subscribe();
  }

  nodeTypeLabel(nodeType?: string): string {
    if (nodeType === 'catalog') return '分组';
    if (nodeType === 'button') return '操作';
    return '功能';
  }

  logout(): void {
    this.auth.logout().subscribe({
      complete: () => this.finishLogout(),
      error: () => this.finishLogout(),
    });
  }

  private finishLogout(): void {
    this.tokenStorage.clear();
    this.store.signOut();
    this.router.navigateByUrl('/login');
  }
}
