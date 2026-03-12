import { Component, signal, computed } from '@angular/core';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { ActionBarComponent } from '../../shared/components/action-bar/action-bar.component';
import { SearchInputComponent } from '../../shared/components/search-input/search-input.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { CheckboxComponent } from '../../shared/components/checkbox/checkbox.component';
import { TypeBadgeComponent } from '../../shared/components/type-badge/type-badge.component';
import { StatusFilterComponent } from '../../shared/components/status-filter/status-filter.component';
import { CompanyIconComponent } from '../../shared/components/company-icon/company-icon.component';
import { FilterOption } from '../../shared/models';

interface GroupApplicationRow {
  key: string;
  name: string;
  iconColor: string;
  applyType: string;
  applyTypeVariant: 'primary' | 'warning';
  applyTime: string;
  status: string;
  statusVariant: 'warning' | 'success' | 'danger';
  approveTime: string;
  phone: string;
}

@Component({
  selector: 'app-group-application-list',
  imports: [PageHeaderComponent, ActionBarComponent, SearchInputComponent, ButtonComponent, CheckboxComponent, TypeBadgeComponent, StatusFilterComponent, CompanyIconComponent],
  templateUrl: './group-application-list.html',
  styleUrl: './group-application-list.scss',
})
export class GroupApplicationList {
  readonly searchValue = signal('');
  readonly statusFilter = signal('all');
  readonly selectedKeys = signal<string[]>([]);

  readonly filterOptions = signal<FilterOption[]>([
    { value: 'all', label: '全部' },
    { value: 'pending', label: '待审批' },
    { value: 'approved', label: '已通过' },
    { value: 'rejected', label: '已拒绝' },
  ]);

  readonly showBatchActions = computed(() => this.selectedKeys().length > 0);

  readonly allRows = signal<GroupApplicationRow[]>([
    { key: '1', name: '润通资本', iconColor: '#f59e0b', applyType: '加入集团', applyTypeVariant: 'primary', applyTime: '2025/10/10 13:25', status: '待审批', statusVariant: 'warning', approveTime: '-', phone: '15147888855' },
    { key: '2', name: '天诚机械集团', iconColor: '#2e67f4', applyType: '退出集团', applyTypeVariant: 'warning', applyTime: '2025/10/08 09:30', status: '已通过', statusVariant: 'success', approveTime: '2025/10/09 10:00', phone: '13812345678' },
    { key: '3', name: '浩森消费金融集团', iconColor: '#666', applyType: '加入集团', applyTypeVariant: 'primary', applyTime: '2025/10/07 14:20', status: '待审批', statusVariant: 'warning', approveTime: '-', phone: '18965432100' },
    { key: '4', name: 'ACE Studio', iconColor: '#2e67f4', applyType: '加入集团', applyTypeVariant: 'primary', applyTime: '2025/10/06 11:15', status: '已拒绝', statusVariant: 'danger', approveTime: '2025/10/07 09:00', phone: '15678901234' },
    { key: '5', name: 'FOCO', iconColor: '#666', applyType: '退出集团', applyTypeVariant: 'warning', applyTime: '2025/10/05 16:45', status: '待审批', statusVariant: 'warning', approveTime: '-', phone: '13698765432' },
    { key: '6', name: '天格环基', iconColor: '#12b76a', applyType: '加入集团', applyTypeVariant: 'primary', applyTime: '2025/10/04 08:30', status: '已通过', statusVariant: 'success', approveTime: '2025/10/05 14:00', phone: '17712345678' },
    { key: '7', name: 'Painting', iconColor: '#999', applyType: '退出集团', applyTypeVariant: 'warning', applyTime: '2025/10/03 10:00', status: '已拒绝', statusVariant: 'danger', approveTime: '2025/10/04 11:30', phone: '15012348765' },
    { key: '8', name: 'miniCo', iconColor: '#2e67f4', applyType: '加入集团', applyTypeVariant: 'primary', applyTime: '2025/10/02 15:20', status: '待审批', statusVariant: 'warning', approveTime: '-', phone: '18898765432' },
  ]);

  readonly rows = computed(() => {
    const filter = this.statusFilter();
    const all = this.allRows();
    if (filter === 'pending') return all.filter(r => r.statusVariant === 'warning');
    if (filter === 'approved') return all.filter(r => r.statusVariant === 'success');
    if (filter === 'rejected') return all.filter(r => r.statusVariant === 'danger');
    return all;
  });

  readonly allKeys = computed(() => this.rows().map(r => r.key));

  readonly selectAll = computed(() => {
    const keys = this.selectedKeys();
    const all = this.allKeys();
    return keys.length > 0 && keys.length === all.length;
  });

  readonly indeterminate = computed(() => {
    const keys = this.selectedKeys();
    const all = this.allKeys();
    return keys.length > 0 && keys.length < all.length;
  });

  toggleSelectAll(): void {
    if (this.selectAll()) {
      this.selectedKeys.set([]);
    } else {
      this.selectedKeys.set(this.allKeys());
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

  isPending(row: GroupApplicationRow): boolean {
    return row.statusVariant === 'warning';
  }
}
