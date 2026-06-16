import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  computed,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { filter, map } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { TooltipModule } from 'primeng/tooltip';
import { MenuModule } from 'primeng/menu';
import { PopoverModule } from 'primeng/popover';
import { LoadingService } from '../../core/http/loading.service';
import { AuthStore } from '../../core/auth/auth.store';
import { ConfirmService } from '../../core/feedback/confirm.service';
import { ToastService } from '../../core/feedback/toast.service';
import { ThemeService } from '../../core/theme/theme.service';
import { CommandPalette, Command } from './command-palette';

interface NavItem {
  label: string;
  path: string;
  icon: string;
}

const COLLAPSE_KEY = 'passauth-sidebar-collapsed';

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
    MenuModule,
    PopoverModule,
    CommandPalette,
  ],
  styleUrl: './admin-shell.scss',
  template: `
    <div class="admin-shell" [class.is-collapsed]="collapsed()">
      @if (loading.active()) {
        <div class="top-progress" aria-hidden="true"><span></span></div>
      }

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
              [pTooltip]="collapsed() ? item.label : ''"
              tooltipPosition="right"
              (click)="closeNav()"
            >
              <i [class]="item.icon"></i>
              <span class="nav-item__label">{{ item.label }}</span>
            </a>
          }
        </nav>

        <button
          class="sidebar-foot"
          type="button"
          aria-label="账号菜单"
          (click)="userMenu.toggle($event)"
        >
          <span class="sidebar-foot__avatar">{{ avatarLabel() }}</span>
          <div class="sidebar-foot__meta">
            <strong>{{ displayName() }}</strong>
            <small>{{ accountLine() }}</small>
          </div>
          <i class="pi pi-ellipsis-h"></i>
        </button>
      </aside>

      @if (navOpen()) {
        <button class="scrim" type="button" aria-label="关闭导航" (click)="closeNav()"></button>
      }

      <section class="workspace">
        <header class="topbar">
          <div class="topbar__left">
            <button
              class="icon-button mobile-only"
              type="button"
              aria-label="打开导航"
              (click)="openNav()"
            >
              <i class="pi pi-bars"></i>
            </button>
            <button
              class="icon-button desktop-only"
              type="button"
              [pTooltip]="collapsed() ? '展开侧栏' : '收起侧栏'"
              tooltipPosition="bottom"
              aria-label="折叠侧栏"
              (click)="toggleCollapse()"
            >
              <i class="pi pi-bars"></i>
            </button>
            <nav class="crumbs" aria-label="面包屑">
              <a class="crumb crumb--home" routerLink="/">
                <i class="pi pi-th-large"></i>
                <span>控制台</span>
              </a>
              <i class="crumb-sep pi pi-angle-right"></i>
              <button
                class="crumb crumb--current"
                type="button"
                (click)="pageMenu.toggle($event)"
              >
                <i [class]="currentIcon()"></i>
                <span>{{ currentTitle() }}</span>
                <i class="crumb-caret pi pi-chevron-down"></i>
              </button>
              <p-menu #pageMenu [model]="navMenuItems()" [popup]="true" appendTo="body" />
            </nav>
          </div>

          <div class="topbar__right">
            <button class="search-trigger" type="button" (click)="openPalette()">
              <i class="pi pi-search"></i>
              <span>搜索</span>
              <kbd>⌘K</kbd>
            </button>

            <button
              class="icon-button"
              type="button"
              [pTooltip]="theme.isDark() ? '切换亮色' : '切换暗色'"
              tooltipPosition="bottom"
              aria-label="切换主题"
              (click)="theme.toggle()"
            >
              <i [class]="theme.isDark() ? 'pi pi-sun' : 'pi pi-moon'"></i>
            </button>

            <button
              class="icon-button"
              type="button"
              aria-label="通知"
              (click)="notif.toggle($event)"
            >
              <i class="pi pi-bell"></i>
            </button>

            <button class="user-trigger" type="button" (click)="userMenu.toggle($event)">
              <p-avatar [label]="avatarLabel()" shape="circle" styleClass="operator-avatar" />
              <div class="operator">
                <strong>{{ displayName() }}</strong>
                <span>{{ store.user()?.mobile || store.user()?.username || '平台管理员' }}</span>
              </div>
              <i class="pi pi-angle-down"></i>
            </button>
          </div>
        </header>

        <main class="content">
          <router-outlet />
        </main>
      </section>

      <p-menu #userMenu [model]="userMenuItems" [popup]="true" appendTo="body" />

      <p-popover #notif>
        <div class="notif">
          <div class="notif__head">
            <strong>通知</strong>
          </div>
          <div class="notif__empty">
            <i class="pi pi-bell-slash"></i>
            <span>暂无新通知</span>
          </div>
        </div>
      </p-popover>

      <app-command-palette [(open)]="paletteOpen" [commands]="commands()" />
    </div>
  `,
})
export class AdminShell {
  protected readonly store = inject(AuthStore);
  protected readonly loading = inject(LoadingService);
  protected readonly theme = inject(ThemeService);

  protected readonly navOpen = signal(false);
  protected readonly collapsed = signal(this.readCollapsed());
  protected readonly paletteOpen = signal(false);

  protected readonly navItems: NavItem[] = [
    { label: '用户管理', path: '/users', icon: 'pi pi-users' },
    { label: '入驻审核', path: '/onboarding', icon: 'pi pi-building' },
  ];

  protected readonly userMenuItems: MenuItem[] = [
    { label: '个人资料', icon: 'pi pi-user', command: () => this.todo('个人资料') },
    { label: '偏好设置', icon: 'pi pi-cog', command: () => this.todo('偏好设置') },
    { separator: true },
    { label: '退出登录', icon: 'pi pi-sign-out', command: () => this.logout() },
  ];

  private readonly router = inject(Router);
  private readonly confirm = inject(ConfirmService);
  private readonly toast = inject(ToastService);

  private readonly url = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map(() => this.router.url),
    ),
    { initialValue: this.router.url },
  );

  protected readonly displayName = computed(() => this.store.displayName() || '平台管理员');
  protected readonly accountLine = computed(() => {
    const user = this.store.user();
    if (!user) return '平台管理员';
    return user.mobile ? `${user.username} / ${user.mobile}` : user.username;
  });
  protected readonly avatarLabel = computed(() => {
    const name = this.displayName().trim();
    return name ? name.slice(0, 1).toUpperCase() : 'P';
  });
  protected readonly currentNav = computed(() => {
    const url = this.url();
    return this.navItems.find((item) => url.startsWith(item.path)) ?? null;
  });
  protected readonly currentTitle = computed(() => this.currentNav()?.label ?? '控制台');
  protected readonly currentIcon = computed(() => this.currentNav()?.icon ?? 'pi pi-th-large');

  // 面包屑当前页 → 可下拉快速切换到其它页
  protected readonly navMenuItems = computed<MenuItem[]>(() =>
    this.navItems.map((item) => ({
      label: item.label,
      icon: item.icon,
      command: () => this.router.navigateByUrl(item.path),
    })),
  );

  protected readonly commands = computed<Command[]>(() => [
    ...this.navItems.map((item) => ({
      id: item.path,
      label: item.label,
      icon: item.icon,
      hint: '页面',
      action: () => this.router.navigateByUrl(item.path),
    })),
    {
      id: 'theme',
      label: this.theme.isDark() ? '切换到亮色主题' : '切换到暗色主题',
      icon: this.theme.isDark() ? 'pi pi-sun' : 'pi pi-moon',
      hint: '主题',
      action: () => this.theme.toggle(),
    },
    {
      id: 'collapse',
      label: this.collapsed() ? '展开侧边栏' : '收起侧边栏',
      icon: 'pi pi-bars',
      hint: '布局',
      action: () => this.toggleCollapse(),
    },
    {
      id: 'logout',
      label: '退出登录',
      icon: 'pi pi-sign-out',
      hint: '账号',
      action: () => this.logout(),
    },
  ]);

  @HostListener('document:keydown', ['$event'])
  protected onKeydown(event: KeyboardEvent): void {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      this.paletteOpen.update((v) => !v);
    }
  }

  openNav(): void {
    this.navOpen.set(true);
  }

  closeNav(): void {
    this.navOpen.set(false);
  }

  openPalette(): void {
    this.paletteOpen.set(true);
  }

  toggleCollapse(): void {
    const next = !this.collapsed();
    this.collapsed.set(next);
    try {
      localStorage.setItem(COLLAPSE_KEY, next ? '1' : '0');
    } catch {
      /* ignore */
    }
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

  private todo(label: string): void {
    this.toast.info(`${label}功能开发中`);
  }

  private readCollapsed(): boolean {
    try {
      return localStorage.getItem(COLLAPSE_KEY) === '1';
    } catch {
      return false;
    }
  }
}
