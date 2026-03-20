import { Component, signal, computed } from '@angular/core';
import { PageHeaderComponent, SearchInputComponent, ActionBarComponent, FilterSelectComponent, StatusBadgeComponent } from '../../shared/components';
import { type PageState } from '../../shared/models/page-state';

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
  imports: [PageHeaderComponent, SearchInputComponent, ActionBarComponent, FilterSelectComponent, StatusBadgeComponent],
  templateUrl: './application-list.component.html',
  styleUrl: './application-list.component.scss',
})
export class ApplicationListComponent {
  pageState = signal<PageState>('normal');
  searchKeyword = signal('');
  statusFilter = signal('');

  statusOptions = ['待处理', '审批通过', '拒绝'];

  rows = signal<ApplicationRow[]>([
    { id: '1', icon: '润', iconColor: '#e74c3c', name: '润通资本', status: '待处理', shortName: '润通', applyTime: '2025/10/10 13:25', approveTime: '-', phone: '15147888855', checked: false },
    { id: '2', icon: '天', iconColor: '#3498db', name: '天诚机械集团', status: '审批通过', shortName: '天诚', applyTime: '2025/10/10 13:25', approveTime: '2025/10/10 13:25', phone: '15147888855', checked: false },
    { id: '3', icon: '浩', iconColor: '#27ae60', name: '浩鑫消费金融集团', status: '待处理', shortName: '浩鑫集团', applyTime: '2025/10/10 13:25', approveTime: '-', phone: '15147888855', checked: false },
    { id: '4', icon: 'A', iconColor: '#333', name: 'ACE Studio', status: '待处理', shortName: 'ACE', applyTime: '2025/10/10 13:25', approveTime: '-', phone: '15147888855', checked: false },
    { id: '5', icon: 'F', iconColor: '#333', name: 'FOCO', status: '拒绝', shortName: 'FO', applyTime: '2025/10/10 13:25', approveTime: '2025/10/10 13:25', phone: '15147888855', checked: false },
    { id: '6', icon: '天', iconColor: '#3498db', name: '天格环慧', status: '待处理', shortName: '天格', applyTime: '2025/10/10 13:25', approveTime: '-', phone: '15147888855', checked: false },
    { id: '7', icon: 'P', iconColor: '#27ae60', name: 'Painting', status: '待处理', shortName: '润庭', applyTime: '2025/10/10 13:25', approveTime: '-', phone: '15147888855', checked: false },
    { id: '8', icon: 'm', iconColor: '#2980b9', name: 'miniCo', status: '待处理', shortName: '米妮', applyTime: '2025/10/10 13:25', approveTime: '-', phone: '15147888855', checked: false },
    { id: '9', icon: '华', iconColor: '#8e44ad', name: '华通电力', status: '待处理', shortName: '华通', applyTime: '2025/10/10 13:25', approveTime: '-', phone: '15147888855', checked: false },
    { id: '10', icon: '惠', iconColor: '#27ae60', name: '惠华集团', status: '待处理', shortName: '惠华', applyTime: '2025/10/10 13:25', approveTime: '-', phone: '15147888855', checked: false },
    { id: '11', icon: '国', iconColor: '#e67e22', name: '国药集团', status: '待处理', shortName: '国药', applyTime: '2025/10/10 13:25', approveTime: '-', phone: '15147888855', checked: false },
    { id: '12', icon: '国', iconColor: '#1abc9c', name: '国控星鲨', status: '待处理', shortName: '国控', applyTime: '2025/10/10 13:25', approveTime: '-', phone: '15147888855', checked: false },
    { id: '13', icon: '润', iconColor: '#e74c3c', name: '润通资本', status: '待处理', shortName: '润通', applyTime: '2025/10/10 13:25', approveTime: '-', phone: '15147888855', checked: false },
    { id: '14', icon: '润', iconColor: '#e74c3c', name: '润通资本', status: '待处理', shortName: '润通', applyTime: '2025/10/10 13:25', approveTime: '-', phone: '15147888855', checked: false },
  ]);

  isLoading = computed(() => this.pageState() === 'loading');

  get allChecked(): boolean {
    const r = this.rows();
    return r.length > 0 && r.every(row => row.checked);
  }

  onSearch(keyword: string) {
    this.searchKeyword.set(keyword);
  }

  onStatusFilter(status: string) {
    this.statusFilter.set(status);
  }

  toggleCheck(row: ApplicationRow) {
    row.checked = !row.checked;
    this.rows.update(r => [...r]);
  }

  toggleAll() {
    const all = this.allChecked;
    this.rows.update(rows => rows.map(r => ({ ...r, checked: !all })));
  }
}
