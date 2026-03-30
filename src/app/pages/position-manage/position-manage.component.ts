import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { PageHeaderComponent, SearchInputComponent, SplitLayoutComponent, TreeListComponent, ActionBarComponent, ButtonComponent, type TreeNode } from '../../shared/components';
import { type PageState } from '../../shared/models/page-state';
import { PositionApiService } from '../../api';
import { type PositionVo } from '../../api/types/position.type';
import { AuthService } from '../../services/auth.service';

interface PositionRow {
  id: string;
  name: string;
  avatar: string;
  jobNo: string;
  email: string;
  phone: string;
}

@Component({
  selector: 'app-position-manage',
  standalone: true,
  imports: [PageHeaderComponent, SearchInputComponent, SplitLayoutComponent, TreeListComponent, ActionBarComponent, ButtonComponent],
  templateUrl: './position-manage.component.html',
  styleUrl: './position-manage.component.scss',
})
export class PositionManageComponent implements OnInit {
  private positionApi = inject(PositionApiService);
  private auth = inject(AuthService);

  pageState = signal<PageState>('loading');
  searchKeyword = signal('');

  treeItems = signal<TreeNode[]>([]);
  activeTreeId = signal('');

  members = signal<PositionRow[]>([]);

  isLoading = computed(() => this.pageState() === 'loading');

  ngOnInit() {
    this.loadPositionTree();
  }

  loadPositionTree() {
    this.pageState.set('loading');
    const companyId = this.auth.currentUser()?.companyId ?? '';
    this.positionApi.listPosition({ companyId }).subscribe({
      next: (res) => {
        const list = res;
        const items: TreeNode[] = [{
          id: 'root',
          label: this.auth.currentUser()?.name ?? '公司',
          expanded: true,
          children: list.map(p => ({
            id: p.id ?? '',
            label: p.name ?? '',
          })),
        }];
        this.treeItems.set(items);
        if (list.length > 0) {
          this.activeTreeId.set(list[0].id ?? '');
          this.loadPositionUsers(list[0].id ?? '');
        }
        this.pageState.set(list.length > 0 ? 'normal' : 'empty');
      },
      error: () => this.pageState.set('error'),
    });
  }

  loadPositionUsers(positionId: string) {
    const companyId = this.auth.currentUser()?.companyId ?? '';
    this.positionApi.listPositionUser({ positionId, companyId }).subscribe({
      next: (res: any[]) => {
        this.members.set(res.map(u => ({
          id: u.userId ?? '',
          name: u.name ?? '',
          avatar: (u.name ?? '').charAt(0),
          jobNo: u.jobNo ?? '',
          email: u.email ?? '',
          phone: u.mobile ?? '',
        })));
      },
    });
  }

  onSearch(keyword: string) {
    this.searchKeyword.set(keyword);
  }

  onTreeSelect(node: TreeNode) {
    if (node.id === 'root') return;
    this.activeTreeId.set(node.id);
    this.loadPositionUsers(node.id);
  }
}
