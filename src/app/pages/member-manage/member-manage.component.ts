import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { PageHeaderComponent, SearchInputComponent, SplitLayoutComponent, TreeListComponent, ActionBarComponent, ButtonComponent, FilterSelectComponent, type TreeNode } from '../../shared/components';
import { type PageState } from '../../shared/models/page-state';
import { OrganizeApiService, OrganizeMemberApiService } from '../../api';
import { type TreeNodeOrganize, type Organize, type OrganizeUserVo } from '../../api/types/organize.type';
import { AuthService } from '../../services/auth.service';

interface MemberRow {
  id: string;
  name: string;
  avatar: string;
  status: string;
  dept: string;
  position: string;
}

@Component({
  selector: 'app-member-manage',
  standalone: true,
  imports: [PageHeaderComponent, SearchInputComponent, SplitLayoutComponent, TreeListComponent, ActionBarComponent, ButtonComponent, FilterSelectComponent],
  templateUrl: './member-manage.component.html',
  styleUrl: './member-manage.component.scss',
})
export class MemberManageComponent implements OnInit {
  private organizeApi = inject(OrganizeApiService);
  private memberApi = inject(OrganizeMemberApiService);
  private auth = inject(AuthService);

  pageState = signal<PageState>('loading');
  searchKeyword = signal('');

  treeItems = signal<TreeNode[]>([]);
  activeTreeId = signal('');

  members = signal<MemberRow[]>([]);

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
        if (items.length > 0) {
          const firstLeaf = this.findFirstLeaf(items);
          this.activeTreeId.set(firstLeaf.id);
          this.loadMembers(firstLeaf.id);
        }
        this.pageState.set(items.length > 0 ? 'normal' : 'empty');
      },
      error: () => this.pageState.set('error'),
    });
  }

  loadMembers(deptId: string) {
    const companyId = this.auth.currentUser()?.companyId ?? '';
    this.memberApi.listOrganizeMember({ companyId, deptId }).subscribe({
      next: (res) => {
        this.members.set(res.map(m => ({
          id: m.userId ?? '',
          name: m.name ?? m.userName ?? '',
          avatar: (m.name ?? m.userName ?? '').charAt(0),
          status: m.state === 1 ? '已加入' : '未加入',
          dept: m.deptName ?? '',
          position: m.orgName ?? '',
        })));
      },
    });
  }

  onSearch(keyword: string) {
    this.searchKeyword.set(keyword);
  }

  onTreeSelect(node: TreeNode) {
    this.activeTreeId.set(node.id);
    this.loadMembers(node.id);
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

  private findFirstLeaf(items: TreeNode[]): TreeNode {
    for (const item of items) {
      if (!item.children?.length) return item;
      return this.findFirstLeaf(item.children);
    }
    return items[0];
  }
}
