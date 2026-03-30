import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { PageHeaderComponent, SearchInputComponent, ActionBarComponent, ButtonComponent } from '../../shared/components';
import { type PageState } from '../../shared/models/page-state';
import { CompanyApiService } from '../../api';
import { type CompanyVo } from '../../api/types/company.type';
import { CourseCreateDrawerComponent } from './course-create-drawer/course-create-drawer.component';

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
  imports: [PageHeaderComponent, SearchInputComponent, ActionBarComponent, ButtonComponent, CourseCreateDrawerComponent],
  templateUrl: './course-company.component.html',
  styleUrl: './course-company.component.scss',
})
export class CourseCompanyComponent implements OnInit {
  private companyApi = inject(CompanyApiService);

  pageState = signal<PageState>('loading');
  searchKeyword = signal('');

  companies = signal<CourseCompanyRow[]>([]);
  drawerVisible = signal(false);

  isLoading = computed(() => this.pageState() === 'loading');

  get allChecked(): boolean {
    const c = this.companies();
    return c.length > 0 && c.every(r => r.checked);
  }

  ngOnInit() {
    this.loadCompanies();
  }

  loadCompanies() {
    this.pageState.set('loading');
    this.companyApi.loadCompanies({ type: 'course' }).subscribe({
      next: (res) => {
        const rows = res.map(c => this.convertCompany(c));
        this.companies.set(rows);
        this.pageState.set(rows.length > 0 ? 'normal' : 'empty');
      },
      error: () => this.pageState.set('error'),
    });
  }

  onSearch(keyword: string) {
    this.searchKeyword.set(keyword);
    if (!keyword) {
      this.loadCompanies();
      return;
    }
    this.companyApi.searchCompanies({ keyword, pageNum: 1 }).subscribe({
      next: (res) => {
        const rows = res.map((c: any) => ({
          id: c.creditCode ?? '',
          icon: (c.companyName ?? '').charAt(0),
          iconColor: '#333',
          name: c.companyName ?? '',
          shortName: (c.companyName ?? '').slice(0, 2),
          count: 0,
          phone: '',
          checked: false,
          hasChildren: false,
          expanded: false,
        }));
        this.companies.set(rows);
      },
    });
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

  openCreateDrawer() {
    this.drawerVisible.set(true);
  }

  onDrawerClosed() {
    this.drawerVisible.set(false);
  }

  onDrawerSaved() {
    this.drawerVisible.set(false);
    this.loadCompanies();
  }

  deleteSelected() {
    const selected = this.companies().filter(r => r.checked);
    for (const row of selected) {
      this.companyApi.removeCompany({ id: row.id }).subscribe({
        next: () => {
          if (row === selected[selected.length - 1]) {
            this.loadCompanies();
          }
        },
      });
    }
  }

  private convertCompany(c: CompanyVo): CourseCompanyRow {
    return {
      id: c.id ?? '',
      icon: (c.name ?? '').charAt(0),
      iconColor: '#333',
      name: c.name ?? '',
      shortName: c.aliasName ?? (c.name ?? '').slice(0, 2),
      count: c.headCount ?? 0,
      phone: c.contactPhone ?? '',
      checked: false,
      hasChildren: false,
      expanded: false,
    };
  }
}
