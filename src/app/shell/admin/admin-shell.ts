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
          <span class="brand__mark">PA</span>
          <div>
            <strong>PassAuth</strong>
            <span>System Console</span>
          </div>
        </div>

        <nav class="nav">
          @for (item of navItems; track item.path) {
            <a
              class="nav-item"
              [routerLink]="item.path"
              routerLinkActive="nav-item--active"
              [routerLinkActiveOptions]="{ exact: false }"
              (click)="closeNav()"
            >
              <i [class]="item.icon"></i>
              <span>
                <strong>{{ item.label }}</strong>
                <small>{{ item.description }}</small>
              </span>
            </a>
          }
        </nav>

        <div class="sidebar-foot">
          <span>当前身份</span>
          <strong>{{ displayName() }}</strong>
          <small>{{ accountLine() }}</small>
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
      title: '退出平台后台',
      message: '当前平台管理员 token 会从本机清除。',
      confirmText: '退出',
      cancelText: '继续使用',
      danger: true,
    });
    if (!ok) return;
    this.store.signOut();
    this.router.navigateByUrl('/login');
  }
}
