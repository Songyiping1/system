import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { PageHeaderComponent, SearchInputComponent, ActionBarComponent, ButtonComponent, StatsRowComponent, StatusBadgeComponent, type StatItem } from '../../shared/components';
import { type PageState } from '../../shared/models/page-state';
import { CompanyCooperationApiService } from '../../api';
import { AuthService } from '../../services/auth.service';

interface OrgRow {
  id: string;
  name: string;
  icon: string;
  count: number;
  dept: string;
  status: string;
}

@Component({
  selector: 'app-group-hierarchy',
  standalone: true,
  imports: [PageHeaderComponent, SearchInputComponent, ActionBarComponent, ButtonComponent, StatsRowComponent, StatusBadgeComponent],
  templateUrl: './group-hierarchy.component.html',
  styleUrl: './group-hierarchy.component.scss',
})
export class GroupHierarchyComponent implements OnInit {
  private cooperationApi = inject(CompanyCooperationApiService);
  private auth = inject(AuthService);

  pageState = signal<PageState>('loading');
  searchKeyword = signal('');

  stats: StatItem[] = [
    { label: '上级组织', value: 0 },
    { label: '下级组织', value: 0 },
    { label: '本组织人数', value: 0 },
    { label: '直属下级组织人数合', value: 0 },
  ];

  orgList = signal<OrgRow[]>([]);

  isLoading = computed(() => this.pageState() === 'loading');

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.pageState.set('loading');
    const companyId = this.auth.currentUser()?.companyId ?? '';

    this.cooperationApi.getCooperationDetail({ companyId }).subscribe({
      next: (res) => {
        this.stats = [
          { label: '上级组织', value: res.parentCompanyCount ?? 0 },
          { label: '下级组织', value: res.childCompanyCount ?? 0 },
          { label: '本组织人数', value: res.headCount ?? 0 },
          { label: '直属下级组织人数合', value: res.childCompanyHeadCount ?? 0 },
        ];
      },
    });

    this.cooperationApi.getCooperationList({ companyId }).subscribe({
      next: (res) => {
        const rows: OrgRow[] = [];
        const walk = (nodes: any[]) => {
          for (const node of nodes) {
            rows.push({
              id: node.id ?? '',
              name: node.name ?? '',
              icon: (node.name ?? '').charAt(0),
              count: node.headCount ?? 0,
              dept: node.linkDeptName ?? '',
              status: node.state === 1 ? '正常' : node.state === 2 ? '已停用' : '已注销',
            });
            if (node.children?.length) walk(node.children);
          }
        };
        walk(res);
        this.orgList.set(rows);
        this.pageState.set(rows.length > 0 ? 'normal' : 'empty');
      },
      error: () => this.pageState.set('error'),
    });
  }

  onSearch(keyword: string) {
    this.searchKeyword.set(keyword);
  }
}
