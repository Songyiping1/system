import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { PageHeaderComponent, SearchInputComponent, SplitLayoutComponent, TreeListComponent, type TreeNode } from '../../shared/components';
import { type PageState } from '../../shared/models/page-state';
import { RoleApiService } from '../../api';
import { type RoleVo } from '../../api/types';
import { AuthService } from '../../services/auth.service';

interface RoleRow {
  id: string;
  name: string;
  avatar: string;
  dept: string;
  jobNo: string;
  scope: string;
}

@Component({
  selector: 'app-role-manage',
  standalone: true,
  imports: [PageHeaderComponent, SearchInputComponent, SplitLayoutComponent, TreeListComponent],
  templateUrl: './role-manage.component.html',
  styleUrl: './role-manage.component.scss',
})
export class RoleManageComponent implements OnInit {
  private roleApi = inject(RoleApiService);
  private auth = inject(AuthService);

  pageState = signal<PageState>('loading');
  searchKeyword = signal('');

  treeItems = signal<TreeNode[]>([]);
  activeTreeId = signal('');

  members = signal<RoleRow[]>([]);

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
          this.loadRoleUsers(firstLeaf.id);
        }
        this.pageState.set(items.length > 0 ? 'normal' : 'empty');
      },
      error: () => this.pageState.set('error'),
    });
  }

  loadRoleUsers(roleId: string) {
    const companyId = this.auth.currentUser()?.companyId ?? '';
    this.roleApi.listRoleUser({ roleId, companyId }).subscribe({
      next: (res: any[]) => {
        this.members.set(res.map(u => ({
          id: u.userId ?? '',
          name: u.name ?? '',
          avatar: (u.name ?? '').charAt(0),
          dept: u.deptName ?? '',
          jobNo: u.jobNo ?? '',
          scope: u.scope ?? '',
        })));
      },
    });
  }

  onSearch(keyword: string) {
    this.searchKeyword.set(keyword);
  }

  onTreeSelect(node: TreeNode) {
    this.activeTreeId.set(node.id);
    this.loadRoleUsers(node.id);
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
