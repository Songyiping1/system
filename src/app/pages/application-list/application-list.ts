import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { ActionBarComponent } from '../../shared/components/action-bar/action-bar.component';
import { SearchInputComponent } from '../../shared/components/search-input/search-input.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { CheckboxComponent } from '../../shared/components/checkbox/checkbox.component';
import { TypeBadgeComponent } from '../../shared/components/type-badge/type-badge.component';
import { StatusFilterComponent } from '../../shared/components/status-filter/status-filter.component';
import { CompanyIconComponent } from '../../shared/components/company-icon/company-icon.component';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';
import { FilterOption } from '../../shared/models';

@Component({
  selector: 'app-application-list',
  imports: [FormsModule, PageHeaderComponent, ActionBarComponent, SearchInputComponent, ButtonComponent, CheckboxComponent, TypeBadgeComponent, StatusFilterComponent, CompanyIconComponent, DialogComponent],
  templateUrl: './application-list.html',
  styleUrl: './application-list.scss',
})
export class ApplicationList {
  readonly searchValue = signal('');
  readonly statusFilter = signal('all');
  readonly selectedKeys = signal<string[]>([]);
  readonly rejectDialogVisible = signal(false);
  readonly rejectReason = signal('');

  readonly filterOptions = signal<FilterOption[]>([
    { value: 'all', label: '全部状态' },
    { value: 'pending', label: '待处理' },
    { value: 'approved', label: '审核通过' },
    { value: 'rejected', label: '拒绝' },
  ]);

  readonly showBatchActions = computed(() => this.selectedKeys().length > 0);

  readonly rows = signal([
    { key: '1', name: '润通求本', iconColor: '#f59e0b', status: '待处理', statusVariant: 'warning' as const, shortName: '润通', applyTime: '2025/10/10 13:25', approveTime: '-', phone: '15147888855' },
    { key: '2', name: '天诚机械集团', iconColor: '#2e67f4', status: '审批通过', statusVariant: 'success' as const, shortName: '天诚', applyTime: '2025/10/10 13:25', approveTime: '2025/10/10 13:25', phone: '15147888855' },
    { key: '3', name: '浩森消费金融集团', iconColor: '#666', status: '待处理', statusVariant: 'warning' as const, shortName: '浩森集团', applyTime: '2025/10/10 13:25', approveTime: '-', phone: '15147888855' },
    { key: '4', name: 'ACE Studio', iconColor: '#2e67f4', status: '待处理', statusVariant: 'warning' as const, shortName: 'ACE', applyTime: '2025/10/10 13:25', approveTime: '-', phone: '15147888855' },
    { key: '5', name: 'FOCO', iconColor: '#666', status: '拒绝', statusVariant: 'danger' as const, shortName: 'FO', applyTime: '2025/10/10 13:25', approveTime: '2025/10/10 13:25', phone: '15147888855' },
    { key: '6', name: '天格环基', iconColor: '#12b76a', status: '待处理', statusVariant: 'warning' as const, shortName: '天格', applyTime: '2025/10/10 13:25', approveTime: '-', phone: '15147888855' },
    { key: '7', name: 'Painting', iconColor: '#999', status: '待处理', statusVariant: 'warning' as const, shortName: '涂庭', applyTime: '2025/10/10 13:25', approveTime: '-', phone: '15147888855' },
    { key: '8', name: 'miniCo', iconColor: '#2e67f4', status: '待处理', statusVariant: 'warning' as const, shortName: '米妮', applyTime: '2025/10/10 13:25', approveTime: '-', phone: '15147888855' },
    { key: '9', name: '华通电力', iconColor: '#2e67f4', status: '待处理', statusVariant: 'warning' as const, shortName: '华通', applyTime: '2025/10/10 13:25', approveTime: '-', phone: '15147888855' },
    { key: '10', name: '思华集团', iconColor: '#12b76a', status: '待处理', statusVariant: 'warning' as const, shortName: '思华', applyTime: '2025/10/10 13:25', approveTime: '-', phone: '15147888855' },
    { key: '11', name: '国药集团', iconColor: '#12b76a', status: '待处理', statusVariant: 'warning' as const, shortName: '国药', applyTime: '2025/10/10 13:25', approveTime: '-', phone: '15147888855' },
    { key: '12', name: '国控星鲨', iconColor: '#2e67f4', status: '待处理', statusVariant: 'warning' as const, shortName: '国控', applyTime: '2025/10/10 13:25', approveTime: '-', phone: '15147888855' },
    { key: '13', name: '润通求本', iconColor: '#f59e0b', status: '待处理', statusVariant: 'warning' as const, shortName: '润通', applyTime: '2025/10/10 13:25', approveTime: '-', phone: '15147888855' },
    { key: '14', name: '润通求本', iconColor: '#f59e0b', status: '待处理', statusVariant: 'warning' as const, shortName: '润通', applyTime: '2025/10/10 13:25', approveTime: '-', phone: '15147888855' },
  ]);

  readonly selectableKeys = computed(() => this.rows().filter(r => r.status === '待处理').map(r => r.key));

  readonly selectAll = computed(() => {
    const keys = this.selectedKeys();
    const selectable = this.selectableKeys();
    return selectable.length > 0 && keys.length === selectable.length;
  });

  readonly indeterminate = computed(() => {
    const keys = this.selectedKeys();
    const selectable = this.selectableKeys();
    return keys.length > 0 && keys.length < selectable.length;
  });

  isRowDisabled(row: { status: string }): boolean {
    return row.status !== '待处理';
  }

  toggleSelectAll(): void {
    if (this.selectAll()) {
      this.selectedKeys.set([]);
    } else {
      this.selectedKeys.set(this.selectableKeys());
    }
  }

  toggleRow(key: string): void {
    const keys = this.selectedKeys();
    if (keys.includes(key)) {
      this.selectedKeys.set(keys.filter(k => k !== key));
    } else {
      this.selectedKeys.set([...keys, key]);
    }
  }

  isSelected(key: string): boolean {
    return this.selectedKeys().includes(key);
  }

  openRejectDialog(): void {
    this.rejectReason.set('');
    this.rejectDialogVisible.set(true);
  }

  closeRejectDialog(): void {
    this.rejectDialogVisible.set(false);
  }

  confirmReject(): void {
    // TODO: call API with this.rejectReason() and this.selectedKeys()
    this.rejectDialogVisible.set(false);
    this.selectedKeys.set([]);
  }
}
