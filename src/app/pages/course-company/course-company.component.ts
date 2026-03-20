import { Component, signal, computed } from '@angular/core';
import { PageHeaderComponent, SearchInputComponent, ActionBarComponent, ButtonComponent } from '../../shared/components';
import { type PageState } from '../../shared/models/page-state';

export interface CourseCompanyRow {
  id: string;
  icon: string;
  iconColor: string;
  name: string;
  shortName: string;
  count: number;
  phone: string;
  checked: boolean;
  hasChildren: boolean;
  expanded: boolean;
}

@Component({
  selector: 'app-course-company',
  standalone: true,
  imports: [PageHeaderComponent, SearchInputComponent, ActionBarComponent, ButtonComponent],
  templateUrl: './course-company.component.html',
  styleUrl: './course-company.component.scss',
})
export class CourseCompanyComponent {
  pageState = signal<PageState>('normal');
  searchKeyword = signal('');

  companies = signal<CourseCompanyRow[]>([
    { id: '1', icon: '商', iconColor: '#e74c3c', name: '商道课', shortName: '商道', count: 70, phone: '15147888855', checked: false, hasChildren: true, expanded: false },
    { id: '2', icon: '全', iconColor: '#27ae60', name: '全员协同课程', shortName: '商道', count: 12, phone: '15147888855', checked: false, hasChildren: true, expanded: false },
    { id: '3', icon: '家', iconColor: '#3498db', name: '家道课', shortName: '商道', count: 31, phone: '15147888855', checked: false, hasChildren: true, expanded: false },
  ]);

  isLoading = computed(() => this.pageState() === 'loading');

  get allChecked(): boolean {
    const c = this.companies();
    return c.length > 0 && c.every(r => r.checked);
  }

  onSearch(keyword: string) {
    this.searchKeyword.set(keyword);
  }

  toggleCheck(row: CourseCompanyRow) {
    row.checked = !row.checked;
    this.companies.update(c => [...c]);
  }

  toggleAll() {
    const all = this.allChecked;
    this.companies.update(rows => rows.map(r => ({ ...r, checked: !all })));
  }

  toggleExpand(row: CourseCompanyRow, event: Event) {
    event.stopPropagation();
    row.expanded = !row.expanded;
    this.companies.update(c => [...c]);
  }
}
