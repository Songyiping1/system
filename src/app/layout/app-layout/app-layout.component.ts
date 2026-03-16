import { Component, inject, signal, computed, viewChild } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavItem, MenuGroup, Tab } from '../../shared/models';
import { IconSidebarComponent } from '../icon-sidebar/icon-sidebar.component';
import { SubSidebarComponent } from '../sub-sidebar/sub-sidebar.component';
import { TopTabBarComponent } from '../top-tab-bar/top-tab-bar.component';
import { ChangePassword } from '../../pages/change-password/change-password';
import { ThemeService } from '../../shared/services/theme.service';

interface Account {
  key: string;
  name: string;
  company: string;
  theme: string;
  navItems: NavItem[];
  menuGroups: Record<string, MenuGroup[]>;
}

const ACCOUNTS: Account[] = [
  {
    key: 'account-1',
    name: '张竞元',
    company: '中企云链（北京）信息科技有限公司',
    theme: 'blue',
    navItems: [
      { key: 'control', icon: 'control', label: '控制中心' },
      { key: 'support', icon: 'support', label: '客服' },
    ],
    menuGroups: {
      control: [
        {
          title: '菜单',
          items: [
            { key: 'menu-manage', label: '菜单管理' },
            { key: 'menu-assign', label: '菜单分配' },
          ],
        },
        {
          title: '公司',
          items: [
            { key: 'company-resource', label: '公司资源管理' },
            { key: 'course-company', label: '课程公司管理' },
            { key: 'application-list', label: '入驻申请列表' },
          ],
        },
      ],
      support: [
        {
          title: '客服',
          items: [],
        },
      ],
    },
  },
  {
    key: 'account-2',
    name: '张竞元',
    company: '中企云链（北京）信息科技有限公司',
    theme: 'dark',
    navItems: [
      { key: 'org', icon: 'org', label: '组织架构' },
      { key: 'collab', icon: 'collab', label: '对外协作' },
      { key: 'permission', icon: 'permission', label: '权限' },
      { key: 'compliance', icon: 'compliance', label: '合规' },
    ],
    menuGroups: {
      org: [
        {
          title: '组织架构',
          items: [
            { key: 'member-manage', label: '成员管理' },
            { key: 'role-manage', label: '角色管理' },
            { key: 'position-manage', label: '岗位管理' },
          ],
        },
      ],
      collab: [
        {
          title: '组织',
          items: [
            { key: 'application-list', label: '关联组织申请列表' },
          ],
        },
        {
          title: '集团',
          items: [
            { key: 'group-hierarchy', label: '集团上下级' },
            { key: 'group-application-list', label: '集团上下级申请列表' },
          ],
        },
      ],
      permission: [
        {
          title: '分配',
          items: [
            { key: 'menu-assign-new', label: '菜单分配' },
            { key: 'admin-assign', label: '管理员分配' },
          ],
        },
        {
          title: '权限审计',
          items: [
            { key: 'permission-query', label: '菜单权限查询' },
            { key: 'member-permission-change', label: '成员菜单权限变更' },
            { key: 'member-admin-permission', label: '成员管理权限' },
          ],
        },
      ],
      compliance: [
        {
          title: '合规',
          items: [],
        },
      ],
    },
  },
];

@Component({
  selector: 'app-layout',
  templateUrl: './app-layout.component.html',
  styleUrl: './app-layout.component.scss',
  imports: [
    RouterOutlet,
    IconSidebarComponent,
    SubSidebarComponent,
    TopTabBarComponent,
    ChangePassword,
  ],
})
export class AppLayoutComponent {
  private readonly router = inject(Router);
  private readonly themeService = inject(ThemeService);
  private readonly changePasswordRef = viewChild(ChangePassword);

  private readonly currentAccount = signal<Account>(ACCOUNTS[0]);

  readonly navItems = computed(() => this.currentAccount().navItems);
  readonly activeNavKey = signal('control');

  private readonly menuGroupsMap = computed(() => this.currentAccount().menuGroups);

  readonly menuGroups = computed(() => {
    return this.menuGroupsMap()[this.activeNavKey()] ?? [];
  });

  readonly activeMenuKey = signal('menu-manage');

  readonly tabs = signal<Tab[]>([
    { key: 'home', label: '首页', closable: true },
    { key: 'control-center', label: '控制中心', closable: true },
  ]);
  readonly activeTabKey = signal('control-center');
  readonly notificationCount = signal(2);

  constructor() {
    this.themeService.applyTheme(this.currentAccount().theme);
  }

  onNavChange(key: string): void {
    this.activeNavKey.set(key);
    const groups = this.menuGroupsMap()[key] ?? [];
    const firstItem = groups[0]?.items[0];
    if (firstItem) {
      this.activeMenuKey.set(firstItem.key);
      this.router.navigate(['/' + firstItem.key]);
    }
  }

  onMenuChange(key: string): void {
    this.activeMenuKey.set(key);
    this.router.navigate(['/' + key]);
  }

  onMenuAction(action: string): void {
    if (action === 'change-password') {
      this.changePasswordRef()?.open();
    }
    if (action === 'switch-account') {
      this.switchAccount();
    }
  }

  private switchAccount(): void {
    const current = this.currentAccount();
    const nextIndex = (ACCOUNTS.indexOf(current) + 1) % ACCOUNTS.length;
    const next = ACCOUNTS[nextIndex];

    this.currentAccount.set(next);
    this.themeService.applyTheme(next.theme);

    // Navigate to first menu item of the first nav
    const firstNav = next.navItems[0];
    if (firstNav) {
      this.activeNavKey.set(firstNav.key);
      const groups = next.menuGroups[firstNav.key] ?? [];
      const firstItem = groups[0]?.items[0];
      if (firstItem) {
        this.activeMenuKey.set(firstItem.key);
        this.router.navigate(['/' + firstItem.key]);
      }
    }
  }

  closeTab(key: string): void {
    const currentTabs = this.tabs();
    const index = currentTabs.findIndex((tab) => tab.key === key);
    if (index === -1) return;

    const newTabs = currentTabs.filter((tab) => tab.key !== key);
    this.tabs.set(newTabs);

    if (this.activeTabKey() === key && newTabs.length > 0) {
      const newIndex = Math.min(index, newTabs.length - 1);
      this.activeTabKey.set(newTabs[newIndex].key);
    }
  }
}
