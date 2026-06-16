import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { TooltipModule } from 'primeng/tooltip';
import { LoadingService } from '../../core/http/loading.service';
import { AuthStore } from '../../core/auth/auth.store';
import { ConfirmService } from '../../core/feedback/confirm.service';

interface NavItem {
  label: string;
  path: string;
  icon: string;
  description: string;
}

@Component({
  selector: 'app-admin-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    ButtonModule,
    AvatarModule,
    TooltipModule,
  ],
  styleUrl: './admin-shell.scss',
  template: `
    <div class="admin-shell">
      <aside class="sidebar" [class.sidebar--open]="navOpen()" aria-label="平台后台导航">
        <div class="brand">
          <span class="brand__mark" aria-hidden="true">
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M16 2.6 26.4 6.6 V14.8 C26.4 21.6 22 26.4 16 29.4 C10 26.4 5.6 21.6 5.6 14.8 V6.6 Z"
                fill="var(--primary)"
              />
              <path
                d="M11.2 16 14.6 19.4 20.9 12.6"
                stroke="var(--on-primary)"
                stroke-width="2.6"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
          <div class="brand__copy">
            <strong>PassAuth</strong>
            <span>System Console</span>
          </div>
        </div>

        <nav class="nav">
          <p class="nav-label">管理</p>
          @for (item of navItems; track item.path) {
            <a
              class="nav-item"
              [routerLink]="item.path"
              routerLinkActive="nav-item--active"
              [routerLinkActiveOptions]="{ exact: false }"
              (click)="closeNav()"
            >
              <i [class]="item.icon"></i>
              <span class="nav-item__label">{{ item.label }}</span>
            </a>
          }
        </nav>

        <div class="sidebar-foot">
          <span class="sidebar-foot__avatar">{{ avatarLabel() }}</span>
          <div class="sidebar-foot__meta">
            <strong>{{ displayName() }}</strong>
            <small>{{ accountLine() }}</small>
          </div>
        </div>
      </aside>

      @if (navOpen()) {
        <button class="scrim" type="button" aria-label="关闭导航" (click)="closeNav()"></button>
      }

      <section class="workspace">
        <header class="topbar">
          <div class="topbar__left">
            <button class="icon-button mobile-only" type="button" aria-label="打开导航" (click)="openNav()">
              <i class="pi pi-bars"></i>
            </button>
            <div>
              <span class="eyebrow">平台管理</span>
              <h1>{{ currentTitle() }}</h1>
            </div>
          </div>

          <div class="topbar__right">
            @if (loading.active()) {
              <span class="syncing" aria-live="polite">
                <i class="pi pi-spin pi-spinner"></i>
                请求处理中
              </span>
            }
            <p-avatar
              [label]="avatarLabel()"
              shape="circle"
              styleClass="operator-avatar"
            />
            <div class="operator">
              <strong>{{ displayName() }}</strong>
              <span>{{ store.user()?.mobile || store.user()?.username || '-' }}</span>
            </div>
            <p-button
              icon="pi pi-sign-out"
              [text]="true"
              severity="secondary"
              pTooltip="退出登录"
              tooltipPosition="bottom"
              ariaLabel="退出登录"
              (onClick)="logout()"
            />
          </div>
        </header>

        <main class="content">
          <router-outlet />
        </main>
      </section>
    </div>
  `,
})
export class AdminShell {
  protected readonly store = inject(AuthStore);
  protected readonly loading = inject(LoadingService);
  protected readonly navOpen = signal(false);

  protected readonly navItems: NavItem[] = [
    {
      label: '用户管理',
      path: '/users',
      icon: 'pi pi-users',
      description: '账号状态与会话',
    },
    {
      label: '入驻审核',
      path: '/onboarding',
      icon: 'pi pi-building',
      description: '公司申请审批',
    },
  ];

  protected readonly displayName = computed(() => this.store.displayName() || '平台管理员');
  protected readonly accountLine = computed(() => {
    const user = this.store.user();
    if (!user) return '-';
    return user.mobile ? `${user.username} / ${user.mobile}` : user.username;
  });
  protected readonly avatarLabel = computed(() => {
    const name = this.displayName().trim();
    return name ? name.slice(0, 1).toUpperCase() : 'P';
  });
  protected readonly currentTitle = computed(() => {
    const url = this.router.url;
    return this.navItems.find((item) => url.startsWith(item.path))?.label ?? '控制台';
  });

  private readonly router = inject(Router);
  private readonly confirm = inject(ConfirmService);

  openNav(): void {
    this.navOpen.set(true);
  }

  closeNav(): void {
    this.navOpen.set(false);
  }

  async logout(): Promise<void> {
    const ok = await this.confirm.ask({
      title: '退出登录',
      message: '确定要退出当前账号吗？',
      confirmText: '退出',
      cancelText: '取消',
      danger: true,
    });
    if (!ok) return;
    this.store.signOut();
    this.router.navigateByUrl('/login');
  }
}
