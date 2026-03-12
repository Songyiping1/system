import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavItem, MenuGroup, Tab } from '../../shared/models';
import { IconSidebarComponent } from '../icon-sidebar/icon-sidebar.component';
import { SubSidebarComponent } from '../sub-sidebar/sub-sidebar.component';
import { TopTabBarComponent } from '../top-tab-bar/top-tab-bar.component';

@Component({
  selector: 'app-layout',
  templateUrl: './app-layout.component.html',
  styleUrl: './app-layout.component.scss',
  imports: [
    RouterOutlet,
    IconSidebarComponent,
    SubSidebarComponent,
    TopTabBarComponent,
  ],
})
export class AppLayoutComponent {
  private readonly router = inject(Router);

  readonly navItems = signal<NavItem[]>([
    { key: 'control-center', icon: 'control', label: '控制中心' },
    { key: 'support', icon: 'support', label: '支持' },
  ]);
  readonly activeNavKey = signal('control-center');

  readonly menuGroups = signal<MenuGroup[]>([
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
  ]);
  readonly activeMenuKey = signal('menu-manage');

  readonly tabs = signal<Tab[]>([
    { key: 'home', label: '首页', closable: true },
    { key: 'control-center', label: '控制中心', closable: true },
  ]);
  readonly activeTabKey = signal('control-center');
  readonly notificationCount = signal(2);

  onMenuChange(key: string): void {
    this.activeMenuKey.set(key);
    this.router.navigate(['/' + key]);
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
