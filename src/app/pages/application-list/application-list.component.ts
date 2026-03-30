import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageHeaderComponent, SearchInputComponent, ActionBarComponent, FilterSelectComponent, StatusBadgeComponent, ModalComponent } from '../../shared/components';
import { type PageState } from '../../shared/models/page-state';
import { CompanyApiService } from '../../api';
import { type CompanyVo } from '../../api/types/company.type';
import { AuthService } from '../../services/auth.service';

export interface ApplicationRow {
  id: string;
  icon: string;
  iconColor: string;
  name: string;
  status: string;
  shortName: string;
  applyTime: string;
  approveTime: string;
  phone: string;
  checked: boolean;
}

@Component({
  selector: 'app-application-list',
  standalone: true,
  imports: [FormsModule, PageHeaderComponent, SearchInputComponent, ActionBarComponent, FilterSelectComponent, StatusBadgeComponent, ModalComponent],
  templateUrl: './application-list.component.html',
  styleUrl: './application-list.component.scss',
})
export class ApplicationListComponent implements OnInit {
  private companyApi = inject(CompanyApiService);
  private auth = inject(AuthService);

  pageState = signal<PageState>('loading');
  searchKeyword = signal('');
  statusFilter = signal('');

  statusOptions = ['待处理', '审批通过', '拒绝'];

  rows = signal<ApplicationRow[]>([]);
  rejectVisible = signal(false);
  rejectReason = signal('');
  rejectTargetId = signal('');

  isLoading = computed(() => this.pageState() === 'loading');

  get allChecked(): boolean {
    const r = this.rows();
    return r.length > 0 && r.every(row => row.checked);
  }

  ngOnInit() {
    this.loadApplyList();
  }

  loadApplyList(applyStatus?: number) {
    this.pageState.set('loading');
    const companyId = this.auth.currentUser()?.companyId ?? '';
    this.companyApi.listApply({ companyId, applyStatus }).subscribe({
      next: (res) => {
        const rows = res.map(c => this.convertApply(c));
        this.rows.set(rows);
        this.pageState.set(rows.length > 0 ? 'normal' : 'empty');
      },
      error: () => this.pageState.set('error'),
    });
  }

  onSearch(keyword: string) {
    this.searchKeyword.set(keyword);
  }

  onStatusFilter(status: string) {
    this.statusFilter.set(status);
    const statusMap: Record<string, number> = { '待处理': 0, '审批通过': 1, '拒绝': 2 };
    this.loadApplyList(status ? statusMap[status] : undefined);
  }

  toggleCheck(row: ApplicationRow) {
    row.checked = !row.checked;
    this.rows.update(r => [...r]);
  }

  toggleAll() {
    const all = this.allChecked;
    this.rows.update(rows => rows.map(r => ({ ...r, checked: !all })));
  }

  openReject(id: string) {
    this.rejectTargetId.set(id);
    this.rejectReason.set('');
    this.rejectVisible.set(true);
  }

  closeReject() {
    this.rejectVisible.set(false);
  }

  confirmReject() {
    this.companyApi.reviewApply({ id: this.rejectTargetId(), applyStatus: 2 }).subscribe({
      next: () => {
        this.rejectVisible.set(false);
        this.loadApplyList();
      },
    });
  }

  reviewApply(id: string, applyStatus: number) {
    this.companyApi.reviewApply({ id, applyStatus }).subscribe({
      next: () => this.loadApplyList(),
    });
  }

  private convertApply(c: CompanyVo): ApplicationRow {
    const statusMap: Record<number, string> = { 0: '待处理', 1: '审批通过', 2: '拒绝' };
    return {
      id: c.id ?? '',
      icon: (c.name ?? '').charAt(0),
      iconColor: '#333',
      name: c.name ?? '',
      status: statusMap[c.applyStatus ?? 0] ?? '待处理',
      shortName: c.aliasName ?? (c.name ?? '').slice(0, 2),
      applyTime: c.applyTime ?? '-',
      approveTime: c.approvalTime ?? '-',
      phone: c.contactPhone ?? '',
      checked: false,
    };
  }
}
