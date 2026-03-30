import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { PageHeaderComponent, SearchInputComponent, SplitLayoutComponent, TreeListComponent, type TreeNode } from '../../shared/components';
import { type PageState } from '../../shared/models/page-state';
import { OrganizeApiService, OrganizeMemberApiService, MenuApiService } from '../../api';
import { type TreeNodeOrganize, type Organize, type OrganizeUserVo } from '../../api/types/organize.type';
import { AuthService } from '../../services/auth.service';

interface PermissionRow {
  id: string;
  name: string;
  level: number;
  route: string;
  source: string;
  desc: string;
  expanded?: boolean;
  children?: PermissionRow[];
}

@Component({
  selector: 'app-permission-query',
  standalone: true,
  imports: [PageHeaderComponent, SearchInputComponent, SplitLayoutComponent, TreeListComponent],
  templateUrl: './permission-query.component.html',
  styleUrl: './permission-query.component.scss',
})
export class PermissionQueryComponent implements OnInit {
  private organizeApi = inject(OrganizeApiService);
  private memberApi = inject(OrganizeMemberApiService);
  private menuApi = inject(MenuApiService);
  private auth = inject(AuthService);

  pageState = signal<PageState>('loading');
  searchKeyword = signal('');
  selectedPerson = signal('');
  selectedUserId = signal('');

  treeItems = signal<TreeNode[]>([]);
  activeTreeId = signal('');

  permissionItems = signal<PermissionRow[]>([]);

  isLoading = computed(() => this.pageState() === 'loading');

  ngOnInit() {
    this.loadOrganizeTree();
  }

  loadOrganizeTree() {
    this.pageState.set('loading');
    const companyId = this.auth.currentUser()?.companyId ?? '';
    this.organizeApi.loadOrganize({ companyId }).subscribe({
      next: (res) => {
        const items = this.convertOrgTree(res);
        this.treeItems.set(items);
        this.pageState.set(items.length > 0 ? 'normal' : 'empty');
      },
      error: () => this.pageState.set('error'),
    });
  }

  loadUserAuth(userId: string) {
    const companyId = this.auth.currentUser()?.companyId ?? '';
    this.menuApi.getUserAuthTree({ companyId, userId }).subscribe({
      next: (res) => {
        this.permissionItems.set(this.convertAuthTree(res, 0));
      },
    });
  }

  onSearch(keyword: string) {
    this.searchKeyword.set(keyword);
  }

  onTreeSelect(node: TreeNode) {
    this.activeTreeId.set(node.id);
    if (!node.children || node.children.length === 0) {
      this.selectedPerson.set(node.label);
      this.selectedUserId.set(node.id);
      this.loadUserAuth(node.id);
    }
  }

  flattenPermissions(): PermissionRow[] {
    const result: PermissionRow[] = [];
    const flatten = (items: PermissionRow[]) => {
      for (const item of items) {
        result.push(item);
        if (item.expanded && item.children) {
          flatten(item.children);
        }
      }
    };
    flatten(this.permissionItems());
    return result;
  }

  toggleExpand(item: PermissionRow) {
    item.expanded = !item.expanded;
    this.permissionItems.update(items => [...items]);
  }

  private convertOrgTree(nodes: TreeNodeOrganize[]): TreeNode[] {
    return nodes.map(node => {
      const children = node.children?.length ? this.convertOrgTree(node.children) : undefined;
      return {
        id: node.id ?? '',
        label: node.name ?? '',
        expanded: true,
        children,
      };
    });
  }

  private convertAuthTree(nodes: any[], level: number): PermissionRow[] {
    return nodes.map(node => {
      const children = node.children?.length ? this.convertAuthTree(node.children, level + 1) : undefined;
      return {
        id: node.id ?? '',
        name: node.name ?? '',
        level,
        route: node.route ?? '',
        source: node.source ?? '',
        desc: node.description ?? '',
        expanded: true,
        children,
      };
    });
  }
}
