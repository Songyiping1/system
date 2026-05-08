import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { PageHeaderComponent, SearchInputComponent, ButtonComponent, ModalComponent } from '../../shared/components';
import { type PageState } from '../../shared/models/page-state';
import { CompanyApiService, MenuApiService } from '../../api';
import { type TreeNodeCompanyVo, type CompanyVo } from '../../api/types/company.type';
import { type TreeNodeMenu } from '../../api/types/menu.type';
import { AuthService } from '../../services/auth.service';

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
  imports: [PageHeaderComponent, SearchInputComponent, ButtonComponent, ModalComponent],
  templateUrl: './menu-assign.component.html',
  styleUrl: './menu-assign.component.scss',
})
export class MenuAssignComponent implements OnInit {
  private companyApi = inject(CompanyApiService);
  private menuApi = inject(MenuApiService);
  private auth = inject(AuthService);

  pageState = signal<PageState>('loading');
  searchKeyword = signal('');
  activeCompanyId = signal('');
  cancelModalVisible = signal(false);

  companies = signal<CompanyItem[]>([]);

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

  assignRows = signal<AssignRow[]>([]);

  flatAssignRows = computed(() => {
    const result: { row: AssignRow; level: number }[] = [];
    const walk = (rows: AssignRow[], level: number) => {
      for (const row of rows) {
        result.push({ row, level });
        if (row.expanded && row.children?.length) {
          walk(row.children, level + 1);
        }
      }
    };
    walk(this.assignRows(), 0);
    return result;
  });

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

  ngOnInit() {
    this.loadCompanies();
  }

  loadCompanies() {
    this.pageState.set('loading');
    this.companyApi.listCompanies().subscribe({
      next: (res) => {
        const items = this.convertCompanyTree(res);
        this.companies.set(items);
        if (items.length > 0) {
          this.activeCompanyId.set(items[0].id);
          this.loadMenusWithAssigned(items[0].id);
        }
        this.pageState.set(items.length > 0 ? 'normal' : 'empty');
      },
      error: () => this.pageState.set('error'),
    });
  }

  loadMenusWithAssigned(companyId: string) {
    this.menuApi.loadMenuTree().subscribe({
      next: (allMenus) => {
        this.menuApi.getAssignedMenuIds({ companyId }).subscribe({
          next: (assignedIds) => {
            const idSet = new Set(assignedIds);
            this.assignRows.set(this.convertMenuTree(allMenus, idSet));
          },
          error: () => {
            // 该公司未分配过菜单，全部默认不勾选
            this.assignRows.set(this.convertMenuTree(allMenus, new Set()));
          },
        });
      },
    });
  }

  onSearch(keyword: string) {
    this.searchKeyword.set(keyword);
  }

  selectCompany(item: CompanyItem) {
    this.activeCompanyId.set(item.id);
    this.loadMenusWithAssigned(item.id);
  }

  toggleCompanyExpand(item: CompanyItem, event: Event) {
    event.stopPropagation();
    item.expanded = !item.expanded;
    this.companies.update(c => [...c]);
  }

  toggleRowExpand(row: AssignRow, event: Event) {
    event.stopPropagation();
    row.expanded = !row.expanded;
    this.assignRows.update(r => [...r]);
  }

  toggleRowCheck(row: AssignRow) {
    if (!row.checked) {
      // 勾选：同时勾选所有祖先
      row.checked = true;
      this.checkAncestors(row.id, this.assignRows());
    } else {
      // 取消：仅当没有子节点被选中时才能取消
      if (this.hasCheckedChild(row)) return;
      row.checked = false;
    }
    this.assignRows.update(r => [...r]);
  }

  isLockedByChild(row: AssignRow): boolean {
    return row.checked && this.hasCheckedChild(row);
  }

  toggleAllCheck() {
    const checked = !this.allChecked;
    const walk = (rows: AssignRow[]) => {
      for (const row of rows) {
        row.checked = checked;
        if (row.children?.length) walk(row.children);
      }
    };
    walk(this.assignRows());
    this.assignRows.update(r => [...r]);
  }

  get allChecked(): boolean {
    return this.assignRows().length > 0 && this.assignRows().every(r => r.checked);
  }

  private hasCheckedChild(row: AssignRow): boolean {
    if (!row.children?.length) return false;
    for (const child of row.children) {
      if (child.checked) return true;
      if (this.hasCheckedChild(child)) return true;
    }
    return false;
  }

  private checkAncestors(childId: string, rows: AssignRow[]): boolean {
    for (const row of rows) {
      if (row.id === childId) return true;
      if (row.children?.length && this.checkAncestors(childId, row.children)) {
        row.checked = true;
        return true;
      }
    }
    return false;
  }

  openCancelModal() {
    this.cancelModalVisible.set(true);
  }

  onCancelConfirmed() {
    this.cancelModalVisible.set(false);
    const companyId = this.activeCompanyId();
    this.menuApi.assignMenu({ companyId, menuIds: [] }).subscribe({
      next: () => this.loadMenusWithAssigned(companyId),
    });
  }

  onCancelDismissed() {
    this.cancelModalVisible.set(false);
  }

  saveAssign() {
    const companyId = this.activeCompanyId();
    const menuIds = this.collectCheckedIds(this.assignRows());
    this.menuApi.assignMenu({ companyId, menuIds }).subscribe({
      next: () => this.loadMenusWithAssigned(companyId),
    });
  }

  private collectCheckedIds(rows: AssignRow[]): string[] {
    const ids: string[] = [];
    for (const row of rows) {
      if (row.checked) ids.push(row.id);
      if (row.children?.length) ids.push(...this.collectCheckedIds(row.children));
    }
    return ids;
  }

  private convertCompanyTree(nodes: TreeNodeCompanyVo[]): CompanyItem[] {
    return nodes.map(node => {
      const children = node.children?.length ? this.convertCompanyTree(node.children) : undefined;
      return {
        id: node.id ?? '',
        name: node.name ?? '',
        icon: (node.name ?? '').charAt(0),
        childCount: node.children?.length ?? 0,
        children,
        expanded: false,
      };
    });
  }

  private convertMenuTree(nodes: TreeNodeMenu[], assignedIds: Set<string>): AssignRow[] {
    return nodes.map(node => {
      const children = node.children?.length ? this.convertMenuTree(node.children, assignedIds) : undefined;
      return {
        id: node.id ?? '',
        name: node.name ?? '',
        icon: 'wehanyu why-setting',
        buyDate: '-',
        period: '-',
        desc: node.description ?? '',
        checked: assignedIds.has(node.id ?? ''),
        childCount: node.children?.length ?? 0,
        children,
        expanded: false,
      };
    });
  }
}
