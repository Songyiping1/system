import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { PageHeaderComponent, SearchInputComponent, SplitLayoutComponent, TreeListComponent, ActionBarComponent, ButtonComponent, type TreeNode } from '../../shared/components';
import { type PageState } from '../../shared/models/page-state';
import { OrganizeApiService, OrganizeMemberApiService, OrganizeBusinessApiService } from '../../api';
import { type TreeNodeOrganize, type Organize, type OrganizeUserVo } from '../../api/types/organize.type';
import { type BizDict } from '../../api/types/common.type';
import { AuthService } from '../../services/auth.service';

interface BusinessRow {
  id: number;
  name: string;
  buyDate: string;
  period: number;
  desc: string;
  assigned: boolean;
}

@Component({
  selector: 'app-admin-assign',
  standalone: true,
  imports: [PageHeaderComponent, SearchInputComponent, SplitLayoutComponent, TreeListComponent, ActionBarComponent, ButtonComponent],
  templateUrl: './admin-assign.component.html',
  styleUrl: './admin-assign.component.scss',
})
export class AdminAssignComponent implements OnInit {
  private organizeApi = inject(OrganizeApiService);
  private memberApi = inject(OrganizeMemberApiService);
  private businessApi = inject(OrganizeBusinessApiService);
  private auth = inject(AuthService);

  pageState = signal<PageState>('loading');
  searchKeyword = signal('');
  selectedMember = signal('');
  selectedUserId = signal('');

  treeItems = signal<TreeNode[]>([]);
  activeTreeId = signal('');

  businessItems = signal<BusinessRow[]>([]);

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

  loadMemberBusiness(userId: string) {
    const companyId = this.auth.currentUser()?.companyId ?? '';

    this.businessApi.getBusinessList({ companyId }).subscribe({
      next: (bizRes: any) => {
        const bizList: BizDict[] = Array.isArray(bizRes) ? bizRes : (bizRes.data ?? bizRes.result ?? []);

        this.businessApi.getAssignedBusinessList({ companyId, userId }).subscribe({
          next: (assignedRes: any) => {
            const assignedIds: number[] = Array.isArray(assignedRes) ? assignedRes : (assignedRes.data ?? assignedRes.result ?? []);
            this.businessItems.set(bizList.map(b => ({
              id: b.id ?? 0,
              name: b.dictValue ?? '',
              buyDate: '-',
              period: 0,
              desc: b.dictCode ?? '',
              assigned: assignedIds.includes(b.id ?? 0),
            })));
          },
        });
      },
    });
  }

  onSearch(keyword: string) {
    this.searchKeyword.set(keyword);
  }

  onTreeSelect(node: TreeNode) {
    this.activeTreeId.set(node.id);
    if (!node.children || node.children.length === 0) {
      this.selectedMember.set(node.label);
      this.selectedUserId.set(node.id);
      this.loadMemberBusiness(node.id);
    }
  }

  saveAssign() {
    const companyId = this.auth.currentUser()?.companyId ?? '';
    const userId = this.selectedUserId();
    const dataIds = this.businessItems().filter(b => b.assigned).map(b => b.id);
    this.businessApi.setBusinessManager({
      userId,
      userName: this.selectedMember(),
      companyId,
      dataIds,
    }).subscribe({
      next: () => this.loadMemberBusiness(userId),
    });
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
}
