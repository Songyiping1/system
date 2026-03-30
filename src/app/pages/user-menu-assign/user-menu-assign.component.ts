import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { PageHeaderComponent, SearchInputComponent, SplitLayoutComponent, TreeListComponent, ActionBarComponent, ButtonComponent, TypeBadgeComponent, type TreeNode } from '../../shared/components';
import { type PageState } from '../../shared/models/page-state';
import { RoleApiService } from '../../api';
import { type RoleVo, type RoleMenuVo } from '../../api/types/role.type';
import { AuthService } from '../../services/auth.service';

interface MenuRow {
  id: string;
  name: string;
  level: number;
  permissions: string[];
  desc: string;
  expanded?: boolean;
  children?: MenuRow[];
}

@Component({
  selector: 'app-user-menu-assign',
  standalone: true,
  imports: [PageHeaderComponent, SearchInputComponent, SplitLayoutComponent, TreeListComponent, ActionBarComponent, ButtonComponent, TypeBadgeComponent],
  templateUrl: './user-menu-assign.component.html',
  styleUrl: './user-menu-assign.component.scss',
})
export class UserMenuAssignComponent implements OnInit {
  private roleApi = inject(RoleApiService);
  private auth = inject(AuthService);

  pageState = signal<PageState>('loading');
  searchKeyword = signal('');
  selectedRoles = signal<string[]>([]);

  treeItems = signal<TreeNode[]>([]);
  activeTreeId = signal('');

  menuItems = signal<MenuRow[]>([]);

  isLoading = computed(() => this.pageState() === 'loading');

  ngOnInit() {
    this.loadRoleTree();
  }

  loadRoleTree() {
    this.pageState.set('loading');
    const companyId = this.auth.currentUser()?.companyId ?? '';
    this.roleApi.listRole({ companyId }).subscribe({
      next: (res) => {
        const items = this.convertRoleTree(res);
        this.treeItems.set(items);
        const firstLeaf = this.findFirstLeaf(items);
        if (firstLeaf) {
          this.activeTreeId.set(firstLeaf.id);
          this.loadRoleMenus(firstLeaf.id);
        }
        this.pageState.set(items.length > 0 ? 'normal' : 'empty');
      },
      error: () => this.pageState.set('error'),
    });
  }

  loadRoleMenus(roleId: string) {
    const companyId = this.auth.currentUser()?.companyId ?? '';
    this.roleApi.getRoleMenuList({ companyId, roleId }).subscribe({
      next: (res) => {
        this.menuItems.set(res.map(m => ({
          id: m.id ?? '',
          name: m.id ?? '',
          level: 0,
          permissions: m.roleNames ?? [],
          desc: '',
        })));
      },
    });
  }

  onSearch(keyword: string) {
    this.searchKeyword.set(keyword);
  }

  onTreeSelect(node: TreeNode) {
    this.activeTreeId.set(node.id);
    this.loadRoleMenus(node.id);
  }

  removeRole(role: string) {
    this.selectedRoles.update(roles => roles.filter(r => r !== role));
  }

  saveMenuAssign() {
    const companyId = this.auth.currentUser()?.companyId ?? '';
    const roleIds = [this.activeTreeId()];
    const menuIds = this.menuItems().map(m => m.id);
    this.roleApi.bindRoleMenu({ companyId, roleIds, menuIds }).subscribe({
      next: () => this.loadRoleMenus(this.activeTreeId()),
    });
  }

  flattenMenuItems(): MenuRow[] {
    const result: MenuRow[] = [];
    const flatten = (items: MenuRow[]) => {
      for (const item of items) {
        result.push(item);
        if (item.expanded && item.children) {
          flatten(item.children);
        }
      }
    };
    flatten(this.menuItems());
    return result;
  }

  toggleExpand(item: MenuRow) {
    item.expanded = !item.expanded;
    this.menuItems.update(items => [...items]);
  }

  private convertRoleTree(roles: RoleVo[]): TreeNode[] {
    return roles.map(r => ({
      id: r.id ?? '',
      label: r.name ?? '',
      expanded: true,
      children: r.children?.length ? this.convertRoleTree(r.children) : undefined,
    }));
  }

  private findFirstLeaf(items: TreeNode[]): TreeNode | null {
    for (const item of items) {
      if (!item.children?.length) return item;
      const found = this.findFirstLeaf(item.children);
      if (found) return found;
    }
    return null;
  }
}
