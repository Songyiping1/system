import { Component, inject, signal, computed, OnInit, ElementRef, afterNextRender } from '@angular/core';
import { PageHeaderComponent, SearchInputComponent, ActionBarComponent, ButtonComponent, ModalComponent } from '../../shared/components';
import { type PageState } from '../../shared/models/page-state';
import { CompanyApiService, MenuApiService } from '../../api';
import { type CompanyVo } from '../../api/types/company.type';
import { type TreeNodeMenu } from '../../api/types/menu.type';
import { CompanyCreateDrawerComponent } from './company-create-drawer/company-create-drawer.component';

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
  imports: [PageHeaderComponent, SearchInputComponent, ActionBarComponent, ButtonComponent, CompanyCreateDrawerComponent, ModalComponent],
  templateUrl: './company-resource.component.html',
  styleUrl: './company-resource.component.scss',
})
export class CompanyResourceComponent implements OnInit {
  private companyApi = inject(CompanyApiService);
  private menuApi = inject(MenuApiService);

  pageState = signal<PageState>('loading');
  searchKeyword = signal('');
  selectedCompanyId = signal<string | null>(null);

  companies = signal<CompanyRow[]>([]);
  detailRows = signal<DetailRow[]>([]);
  drawerVisible = signal(false);
  deleteModalVisible = signal(false);
  menuCollapsed = signal(false);

  isLoading = computed(() => this.pageState() === 'loading');

  get allChecked(): boolean {
    const c = this.companies();
    return c.length > 0 && c.every(r => r.checked);
  }

  ngOnInit() {
    this.loadCompanies();
  }

  onCompanyScroll(event: Event) {
    const el = event.target as HTMLElement;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 2;
    if (atBottom && !this.menuCollapsed()) {
      this.menuCollapsed.set(true);
    }
  }

  loadCompanies() {
    this.pageState.set('loading');
    this.companyApi.loadCompanies({ type: 'company' }).subscribe({
      next: (res) => {
        const rows = res.map(c => this.convertCompany(c));
        this.companies.set(rows);
        if (rows.length > 0) {
          this.selectedCompanyId.set(rows[0].id);
          this.loadCompanyMenus(rows[0].id);
        }
        this.pageState.set(rows.length > 0 ? 'normal' : 'empty');
      },
      error: () => this.pageState.set('error'),
    });
  }

  loadCompanyMenus(companyId: string) {
    this.menuApi.getAssignedMenuList({ companyId }).subscribe({
      next: (res) => {
        this.detailRows.set(this.flattenMenuTree(res));
      },
      error: () => {
        this.detailRows.set([]);
      },
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
        }));
        this.companies.set(rows);
      },
    });
  }

  toggleMenuCollapse() {
    this.menuCollapsed.update(v => !v);
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
    this.loadCompanyMenus(row.id);
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

  openDeleteModal() {
    const selected = this.companies().filter(r => r.checked);
    if (selected.length === 0) return;
    this.deleteModalVisible.set(true);
  }

  onDeleteConfirmed() {
    this.deleteModalVisible.set(false);
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

  onDeleteCancelled() {
    this.deleteModalVisible.set(false);
  }

  private flattenMenuTree(nodes: TreeNodeMenu[]): DetailRow[] {
    const rows: DetailRow[] = [];
    const walk = (list: TreeNodeMenu[]) => {
      for (const node of list) {
        rows.push({
          name: node.name ?? '',
          icon: node.icon?.uri ?? '-',
          buyDate: '-',
          period: '-',
          desc: node.description ?? '',
        });
        if (node.children?.length) walk(node.children);
      }
    };
    walk(nodes);
    return rows;
  }

  private convertCompany(c: CompanyVo): CompanyRow {
    return {
      id: c.id ?? '',
      icon: (c.name ?? '').charAt(0),
      iconColor: '#333',
      name: c.name ?? '',
      shortName: c.aliasName ?? (c.name ?? '').slice(0, 2),
      count: c.headCount ?? 0,
      phone: c.contactPhone ?? '',
      checked: false,
    };
  }
}
