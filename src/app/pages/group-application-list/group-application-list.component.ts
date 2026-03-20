import { Component, signal, computed } from '@angular/core';
import { PageHeaderComponent, SearchInputComponent, ActionBarComponent, FilterSelectComponent, StatusBadgeComponent, ButtonComponent } from '../../shared/components';
import { type PageState } from '../../shared/models/page-state';

interface ApplicationRow {
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
export class GroupApplicationListComponent {
  pageState = signal<PageState>('normal');
  searchKeyword = signal('');

  applications = signal<ApplicationRow[]>([
    { name: '天诚科技', icon: '天', count: 120, status: '待处理', applicant: '赵莫艳', applicantAvatar: '赵', applyTime: '2025-10-15 14:30' },
    { name: '浩鑫集团', icon: '浩', count: 340, status: '审批通过', applicant: '郑婷雅', applicantAvatar: '郑', applyTime: '2025-10-12 09:15' },
    { name: 'ACE Studio', icon: 'A', count: 56, status: '拒绝关联', applicant: '冯云', applicantAvatar: '冯', applyTime: '2025-10-10 16:45' },
    { name: 'FOCO', icon: 'F', count: 89, status: '审批中', applicant: '周健', applicantAvatar: '周', applyTime: '2025-10-08 11:20' },
    { name: '天格环慧', icon: '天', count: 210, status: '待处理', applicant: '王凡玄', applicantAvatar: '王', applyTime: '2025-10-05 08:00' },
  ]);

  isLoading = computed(() => this.pageState() === 'loading');

  onSearch(keyword: string) {
    this.searchKeyword.set(keyword);
  }
}
