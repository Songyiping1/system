import { Component, signal, computed } from '@angular/core';
import { PageHeaderComponent, SearchInputComponent, ActionBarComponent, ButtonComponent } from '../../shared/components';
import { type PageState } from '../../shared/models/page-state';

export interface CompanyRow {
  id: string;
  icon: string;
  iconColor: string;
  name: string;
  shortName: string;
  count: number;
  phone: string;
  checked: boolean;
  hasChildren?: boolean;
  expanded?: boolean;
}

export interface DetailRow {
  name: string;
  icon: string;
  buyDate: string;
  period: string;
  desc: string;
}

@Component({
  selector: 'app-company-resource',
  standalone: true,
  imports: [PageHeaderComponent, SearchInputComponent, ActionBarComponent, ButtonComponent],
  templateUrl: './company-resource.component.html',
  styleUrl: './company-resource.component.scss',
})
export class CompanyResourceComponent {
  pageState = signal<PageState>('normal');
  searchKeyword = signal('');
  selectedCompanyId = signal<string | null>(null);

  companies = signal<CompanyRow[]>([
    { id: '1', icon: '润', iconColor: '#e74c3c', name: '润通求本', shortName: '润通', count: 79, phone: '15147888855', checked: false },
    { id: '2', icon: 'F', iconColor: '#333', name: 'FOCO', shortName: 'FO', count: 12, phone: '15147888855', checked: false },
    { id: '3', icon: '天', iconColor: '#3498db', name: '天格环慧', shortName: '天格', count: 31, phone: '15147888855', checked: false },
    { id: '4', icon: 'P', iconColor: '#27ae60', name: 'Painting', shortName: '润庭', count: 24, phone: '15147888855', checked: false },
    { id: '5', icon: 'm', iconColor: '#2980b9', name: 'miniCo', shortName: '米妮玩', count: 353, phone: '15147888855', checked: false },
    { id: '6', icon: '华', iconColor: '#8e44ad', name: '华通电力', shortName: '华通', count: 56, phone: '15147888855', checked: false },
    { id: '7', icon: '惠', iconColor: '#27ae60', name: '惠华集团', shortName: '惠华', count: 335, phone: '15147888855', checked: false },
    { id: '8', icon: '国', iconColor: '#e67e22', name: '国药集团', shortName: '国药', count: 7121, phone: '15147888855', checked: false },
    { id: '9', icon: '国', iconColor: '#1abc9c', name: '国控星鲨', shortName: '星鲨', count: 6542, phone: '15147888855', checked: false, hasChildren: true },
    { id: '10', icon: '国', iconColor: '#1abc9c', name: '国控星鲨', shortName: '星鲨', count: 6542, phone: '15147888855', checked: false, hasChildren: true },
    { id: '11', icon: '国', iconColor: '#1abc9c', name: '国控星鲨', shortName: '星鲨', count: 6542, phone: '15147888855', checked: false, hasChildren: true },
    { id: '12', icon: '国', iconColor: '#1abc9c', name: '国控星鲨', shortName: '星鲨', count: 6542, phone: '15147888855', checked: false, hasChildren: true },
  ]);

  detailRows = signal<DetailRow[]>([]);

  isLoading = computed(() => this.pageState() === 'loading');

  get allChecked(): boolean {
    const c = this.companies();
    return c.length > 0 && c.every(r => r.checked);
  }

  onSearch(keyword: string) {
    this.searchKeyword.set(keyword);
  }

  toggleCheck(row: CompanyRow) {
    row.checked = !row.checked;
    this.companies.update(c => [...c]);
  }

  toggleAll() {
    const all = this.allChecked;
    this.companies.update(rows => rows.map(r => ({ ...r, checked: !all })));
  }

  selectCompany(row: CompanyRow) {
    this.selectedCompanyId.set(row.id);
  }
}
