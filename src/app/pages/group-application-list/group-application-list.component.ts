import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { PageHeaderComponent, SearchInputComponent, ActionBarComponent, FilterSelectComponent, StatusBadgeComponent, ButtonComponent } from '../../shared/components';
import { type PageState } from '../../shared/models/page-state';
import { CompanyCooperationApiService } from '../../api';
import { type CooperationApplyVo } from '../../api/types/company-cooperation.type';
import { AuthService } from '../../services/auth.service';

interface ApplicationRow {
  id: string;
  name: string;
  icon: string;
  count: number;
  status: string;
  applicant: string;
  applicantAvatar: string;
  applyTime: string;
}

@Component({
  selector: 'app-group-application-list',
  standalone: true,
  imports: [PageHeaderComponent, SearchInputComponent, ActionBarComponent, FilterSelectComponent, StatusBadgeComponent, ButtonComponent],
  templateUrl: './group-application-list.component.html',
  styleUrl: './group-application-list.component.scss',
})
export class GroupApplicationListComponent implements OnInit {
  private cooperationApi = inject(CompanyCooperationApiService);
  private auth = inject(AuthService);

  pageState = signal<PageState>('loading');
  searchKeyword = signal('');

  applications = signal<ApplicationRow[]>([]);

  isLoading = computed(() => this.pageState() === 'loading');

  ngOnInit() {
    this.loadApplyList();
  }

  loadApplyList(status?: number) {
    this.pageState.set('loading');
    const companyId = this.auth.currentUser()?.companyId ?? '';
    this.cooperationApi.listCooperationApply({ companyId, status }).subscribe({
      next: (res) => {
        const rows = res.map(a => this.convertApply(a));
        this.applications.set(rows);
        this.pageState.set(rows.length > 0 ? 'normal' : 'empty');
      },
      error: () => this.pageState.set('error'),
    });
  }

  onSearch(keyword: string) {
    this.searchKeyword.set(keyword);
  }

  reviewApply(companyId: string, parentId: string, status: number) {
    this.cooperationApi.reviewCooperationApply({ companyId, parentId, status }).subscribe({
      next: () => this.loadApplyList(),
    });
  }

  private convertApply(a: CooperationApplyVo): ApplicationRow {
    const statusMap: Record<number, string> = { 0: '待处理', 1: '审批通过', 2: '拒绝关联', 3: '审批中' };
    return {
      id: a.companyId ?? '',
      name: a.companyName ?? '',
      icon: (a.companyName ?? '').charAt(0),
      count: a.headCount ?? 0,
      status: statusMap[a.status ?? 0] ?? '待处理',
      applicant: '',
      applicantAvatar: '',
      applyTime: a.applyTime ?? '',
    };
  }
}
