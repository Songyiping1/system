import { Injectable, signal, computed, inject } from '@angular/core';
import { AuthService, Role } from './auth.service';

export interface NavItem {
  id: string;
  label: string;
  icon: string;
}

export interface SubMenuItem {
  id: string;
  label: string;
  route: string;
  group: string;
}

export interface MenuConfig {
  navItems: NavItem[];
  subMenus: Record<string, SubMenuItem[]>;
}

const ADMIN_CONFIG: MenuConfig = {
  navItems: [
    { id: 'control', label: '控制中心', icon: 'control' },
  ],
  subMenus: {
    control: [
      { id: 'menu-manage', label: '菜单管理', route: '/admin/menu-manage', group: '菜单' },
      { id: 'menu-assign', label: '菜单分配', route: '/admin/menu-assign', group: '菜单' },
      { id: 'company-resource', label: '公司资源管理', route: '/admin/company-resource', group: '公司' },
      { id: 'course-company', label: '课程公司管理', route: '/admin/course-company', group: '公司' },
      { id: 'application-list', label: '入驻申请列表', route: '/admin/application-list', group: '公司' },
    ],
  },
};

const USER_CONFIG: MenuConfig = {
  navItems: [
    { id: 'org', label: '组织架构', icon: 'org' },
    { id: 'collab', label: '对外协作', icon: 'collab' },
    { id: 'perm', label: '权限', icon: 'perm' },
    { id: 'session', label: '会期', icon: 'session' },
  ],
  subMenus: {
    org: [
      { id: 'member-manage', label: '成员管理', route: '/user/member-manage', group: '成员' },
      { id: 'role-manage', label: '角色管理', route: '/user/role-manage', group: '成员' },
      { id: 'position-manage', label: '岗位管理', route: '/user/position-manage', group: '成员' },
    ],
    collab: [
      { id: 'group-hierarchy', label: '集团上下级', route: '/user/group-hierarchy', group: '集团' },
      { id: 'group-application', label: '申请列表', route: '/user/group-application', group: '集团' },
    ],
    perm: [
      { id: 'user-menu-assign', label: '菜单分配', route: '/user/menu-assign', group: '权限管理' },
      { id: 'admin-assign', label: '管理员分配', route: '/user/admin-assign', group: '权限管理' },
      { id: 'member-permission', label: '成员管理权限', route: '/user/member-permission', group: '权限管理' },
      { id: 'permission-query', label: '菜单权限查询', route: '/user/permission-query', group: '权限查询' },
      { id: 'member-perm-change', label: '成员菜单权限变更', route: '/user/member-perm-change', group: '权限查询' },
    ],
  },
};

@Injectable({ providedIn: 'root' })
export class MenuService {
  private auth = inject(AuthService);

  activeNavId = signal('');
  activeSubMenuId = signal('');

  config = computed<MenuConfig>(() => {
    return this.auth.currentUser()?.role === 'admin' ? ADMIN_CONFIG : USER_CONFIG;
  });

  navItems = computed(() => this.config().navItems);

  currentSubMenus = computed(() => {
    const navId = this.activeNavId();
    return this.config().subMenus[navId] ?? [];
  });

  groupedSubMenus = computed(() => {
    const items = this.currentSubMenus();
    const groups: { group: string; items: SubMenuItem[] }[] = [];
    const groupMap = new Map<string, SubMenuItem[]>();

    for (const item of items) {
      if (!groupMap.has(item.group)) {
        groupMap.set(item.group, []);
      }
      groupMap.get(item.group)!.push(item);
    }

    for (const [group, groupItems] of groupMap) {
      groups.push({ group, items: groupItems });
    }

    return groups;
  });

  setActiveNav(id: string) {
    this.activeNavId.set(id);
    const subs = this.config().subMenus[id];
    if (subs?.length) {
      this.activeSubMenuId.set(subs[0].id);
    }
  }

  setActiveSubMenu(id: string) {
    this.activeSubMenuId.set(id);
  }

  initForRole() {
    const nav = this.navItems();
    if (nav.length) {
      this.setActiveNav(nav[0].id);
    }
  }
}
