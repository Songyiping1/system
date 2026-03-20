import { Component, signal, computed } from '@angular/core';
import { PageHeaderComponent, SearchInputComponent, ActionBarComponent, ButtonComponent } from '../../shared/components';
import { type PageState } from '../../shared/models/page-state';

export interface CompanyItem {
  id: string;
  name: string;
  icon: string;
  childCount?: number;
  children?: CompanyItem[];
  expanded?: boolean;
}

export interface AssignRow {
  id: string;
  name: string;
  icon: string;
  buyDate: string;
  period: string;
  desc: string;
  checked: boolean;
  childCount?: number;
  children?: AssignRow[];
  expanded?: boolean;
}

@Component({
  selector: 'app-menu-assign',
  standalone: true,
  imports: [PageHeaderComponent, SearchInputComponent, ActionBarComponent, ButtonComponent],
  templateUrl: './menu-assign.component.html',
  styleUrl: './menu-assign.component.scss',
})
export class MenuAssignComponent {
  pageState = signal<PageState>('normal');
  searchKeyword = signal('');
  activeCompanyId = signal('tianchen');

  companies = signal<CompanyItem[]>([
    { id: 'huihua', name: '惠华集团', icon: '惠', childCount: 2 },
    {
      id: 'runtong', name: '润通资本', icon: '润', childCount: 2,
      expanded: true,
      children: [
        { id: 'tianchen', name: '天诚', icon: '天',
          expanded: true,
          children: [
            { id: 'haoxin', name: '浩鑫集团', icon: '浩' },
            { id: 'ace', name: 'ACE Studio', icon: 'A' },
            { id: 'foco', name: 'FOCO', icon: 'F' },
          ],
        },
      ],
    },
    { id: 'tiange', name: '天格环慧', icon: '天', childCount: 2 },
    { id: 'painting', name: 'Painting', icon: 'P' },
    { id: 'minico', name: 'miniCo', icon: 'm', childCount: 2 },
    { id: 'huatong', name: '华通电力', icon: '华', childCount: 2 },
  ]);

  flatCompanies = computed(() => {
    const result: { item: CompanyItem; level: number }[] = [];
    const walk = (items: CompanyItem[], level: number) => {
      for (const item of items) {
        result.push({ item, level });
        if (item.expanded && item.children?.length) {
          walk(item.children, level + 1);
        }
      }
    };
    walk(this.companies(), 0);
    return result;
  });

  assignRows = signal<AssignRow[]>([
    { id: '1', name: 'T度导向', icon: 'wehanyu why-setting', buyDate: '2025-11-19', period: '365 天', desc: '成员开月，周度导向会议...', checked: true },
    { id: '2', name: '项目管理', icon: 'wehanyu why-setting', buyDate: '2025-11-19', period: '永久', desc: '成员开月，周度导向会议...', checked: true, childCount: 2 },
    { id: '3', name: 'T度导向', icon: 'wehanyu why-setting', buyDate: '2025-11-19', period: '1056 天', desc: '成员开月，周度导向会议...', checked: true },
    { id: '4', name: 'T度导向', icon: 'wehanyu why-setting', buyDate: '2025-11-19', period: '35 天', desc: '成员开月，周度导向会议...', checked: true },
    { id: '5', name: 'T度导向', icon: 'wehanyu why-setting', buyDate: '2025-11-19', period: '65 天', desc: '成员开月，周度导向会议...', checked: false },
    { id: '6', name: 'T度导向', icon: 'wehanyu why-setting', buyDate: '2025-11-19', period: '6548 天', desc: '成员开月，周度导向会议...', checked: false },
    { id: '7', name: 'T度导向', icon: 'wehanyu why-setting', buyDate: '2025-11-19', period: '956 天', desc: '成员开月，周度导向会议...', checked: false, childCount: 2 },
    { id: '8', name: 'T度导向', icon: 'wehanyu why-setting', buyDate: '-', period: '未开通', desc: '成员开月，周度导向会议...', checked: false, childCount: 2 },
    { id: '9', name: 'T度导向', icon: 'wehanyu why-setting', buyDate: '-', period: '未开通', desc: '成员开月，周度导向会议...', checked: false, childCount: 2 },
    { id: '10', name: 'T度导向', icon: 'wehanyu why-setting', buyDate: '-', period: '未开通', desc: '成员开月，周度导向会议...', checked: false, childCount: 2 },
    { id: '11', name: 'T度导向', icon: 'wehanyu why-setting', buyDate: '-', period: '未开通', desc: '成员开月，周度导向会议...', checked: false, childCount: 2 },
    { id: '12', name: 'T度导向', icon: 'wehanyu why-setting', buyDate: '-', period: '未开通', desc: '成员开月，周度导向会议...', checked: false, childCount: 2 },
  ]);

  isLoading = computed(() => this.pageState() === 'loading');

  selectedCompanyName = computed(() => {
    const find = (items: CompanyItem[]): string | null => {
      for (const item of items) {
        if (item.id === this.activeCompanyId()) return item.name;
        if (item.children) {
          const found = find(item.children);
          if (found) return found;
        }
      }
      return null;
    };
    return find(this.companies()) ?? '';
  });

  onSearch(keyword: string) {
    this.searchKeyword.set(keyword);
  }

  selectCompany(item: CompanyItem) {
    this.activeCompanyId.set(item.id);
  }

  toggleCompanyExpand(item: CompanyItem, event: Event) {
    event.stopPropagation();
    item.expanded = !item.expanded;
    this.companies.update(c => [...c]);
  }

  toggleRowCheck(row: AssignRow) {
    row.checked = !row.checked;
    this.assignRows.update(r => [...r]);
  }

  toggleAllCheck() {
    const allChecked = this.assignRows().every(r => r.checked);
    this.assignRows.update(rows => rows.map(r => ({ ...r, checked: !allChecked })));
  }

  get allChecked(): boolean {
    return this.assignRows().length > 0 && this.assignRows().every(r => r.checked);
  }
}
