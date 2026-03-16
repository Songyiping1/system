import { Component, signal, computed } from '@angular/core';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { ActionBarComponent } from '../../shared/components/action-bar/action-bar.component';
import { SearchInputComponent } from '../../shared/components/search-input/search-input.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { CheckboxComponent } from '../../shared/components/checkbox/checkbox.component';
import { ChildCountBadgeComponent } from '../../shared/components/child-count-badge/child-count-badge.component';
import { TreeNode } from '../../shared/models';

interface Company {
  key: string;
  name: string;
  alias: string;
  count: number;
  phone: string;
  color: string;
  children?: Company[];
}

interface FlatRow {
  node: TreeNode;
  level: number;
}

@Component({
  selector: 'app-company-resource',
  imports: [PageHeaderComponent, ActionBarComponent, SearchInputComponent, ButtonComponent, CheckboxComponent, ChildCountBadgeComponent],
  templateUrl: './company-resource.html',
  styleUrl: './company-resource.scss',
})
export class CompanyResource {
  readonly searchValue = signal('');
  readonly checkedKeys = signal<string[]>([]);
  readonly expandedCompanyKeys = signal<string[]>([]);
  readonly selectedCompanyKey = signal<string>('1');
  readonly isTreeCollapsed = signal(false);

  onCompanyWheel(event: WheelEvent): void {
    if (event.deltaY > 0 && !this.isTreeCollapsed()) {
      this.isTreeCollapsed.set(true);
    }
  }

  toggleTreeCollapsed(): void {
    this.isTreeCollapsed.update(v => !v);
  }

  readonly companies = signal<Company[]>([
    { key: '1', name: '润通求本', alias: '润通', count: 25, phone: '15236985471', color: '#2e67f4' },
    { key: '2', name: 'FOCO', alias: 'FOCO', count: 10, phone: '15236985471', color: '#f59e0b' },
    { key: '3', name: '天格环慧', alias: '天格', count: 18, phone: '15236985471', color: '#10b981' },
    { key: '4', name: 'Painting', alias: 'Painting', count: 6, phone: '15236985471', color: '#8b5cf6' },
    { key: '5', name: 'miniCo', alias: 'miniCo', count: 3, phone: '15236985471', color: '#ef4444' },
    { key: '6', name: '华通电力', alias: '华通', count: 42, phone: '15236985471', color: '#06b6d4' },
    { key: '7', name: '思华集团', alias: '思华', count: 88, phone: '15236985471', color: '#f97316' },
    { key: '8', name: '国药集团', alias: '国药', count: 120, phone: '15236985471', color: '#14b8a6' },
    { key: '9', name: '国控星鲨', alias: '国控', count: 55, phone: '15236985471', color: '#6366f1', children: [
      { key: '9-1', name: '星鲨分公司', alias: '星鲨', count: 12, phone: '15236985471', color: '#6366f1' },
    ]},
  ]);

  readonly flattenedCompanies = computed<{ company: Company; level: number }[]>(() => {
    const rows: { company: Company; level: number }[] = [];
    const expanded = new Set(this.expandedCompanyKeys());
    const flatten = (items: Company[], level: number) => {
      for (const item of items) {
        rows.push({ company: item, level });
        if (item.children?.length && expanded.has(item.key)) {
          flatten(item.children, level + 1);
        }
      }
    };
    flatten(this.companies(), 0);
    return rows;
  });

  readonly isAllChecked = computed(() => {
    const all = this.flattenedCompanies();
    return all.length > 0 && all.every(r => this.checkedKeys().includes(r.company.key));
  });

  readonly isIndeterminate = computed(() => {
    const keys = this.checkedKeys();
    const all = this.flattenedCompanies();
    return keys.length > 0 && !all.every(r => keys.includes(r.company.key));
  });

  toggleSelectAll(): void {
    if (this.isAllChecked()) {
      this.checkedKeys.set([]);
    } else {
      this.checkedKeys.set(this.flattenedCompanies().map(r => r.company.key));
    }
  }

  toggleCheck(key: string): void {
    const keys = this.checkedKeys();
    if (keys.includes(key)) {
      this.checkedKeys.set(keys.filter(k => k !== key));
    } else {
      this.checkedKeys.set([...keys, key]);
    }
  }

  isChecked(key: string): boolean {
    return this.checkedKeys().includes(key);
  }

  isCompanyExpanded(key: string): boolean {
    return this.expandedCompanyKeys().includes(key);
  }

  toggleCompanyExpand(key: string): void {
    const keys = this.expandedCompanyKeys();
    if (keys.includes(key)) {
      this.expandedCompanyKeys.set(keys.filter(k => k !== key));
    } else {
      this.expandedCompanyKeys.set([...keys, key]);
    }
  }

  selectCompany(key: string): void {
    this.selectedCompanyKey.set(key);
  }

  getInitial(name: string): string {
    return name.charAt(0);
  }

  getCompanyIndent(level: number): number[] {
    return Array.from({ length: level }, (_, i) => i);
  }

  // ====== Tree table (bottom) ======
  readonly expandedKeys = signal<string[]>(['3']);

  readonly treeData = signal<TreeNode[]>([
    { key: '1', data: { name: 'T度导向', icon: 'wehanyu why-setting', purchaseDate: '2025-10-31 04:00', duration: '365 天', description: '成员开月、周度导向会以及填写日导向等功能' } },
    { key: '2', data: { name: '项目管理', icon: 'wehanyu why-setting', purchaseDate: '2025-11-05 14:41', duration: '永久', description: '成员开月、周度导向会以及填写日导向等功能' }, children: [
      { key: '2-1', data: { name: 'T度导向', icon: 'wehanyu why-setting', purchaseDate: '2025-11-08 16:16', duration: '35 天', description: '成员开月、周度导向会以及填写日导向等功能' } },
    ]},
    { key: '3', data: { name: 'T度导向', icon: 'wehanyu why-setting', purchaseDate: '2025-10-21 17:08', duration: '1056 天', description: '成员开月、周度导向会以及填写日导向等功能' }, children: [
      { key: '3-1', data: { name: 'T度导向', icon: 'wehanyu why-setting', purchaseDate: '2025-11-08 16:16', duration: '35 天', description: '成员开月、周度导向会以及填写日导向等功能' }, children: [
        { key: '3-1-1', data: { name: 'T度导向', icon: 'wehanyu why-setting', purchaseDate: '2025-11-08 20:36', duration: '65 天', description: '成员开月、周度导向会以及填写日导向等功能' } },
      ]},
      { key: '3-2', data: { name: 'T度导向', icon: 'wehanyu why-setting', purchaseDate: '2025-11-08 20:36', duration: '6548 天', description: '成员开月、周度导向会以及填写日导向等功能' } },
      { key: '3-3', data: { name: 'T度导向', icon: 'wehanyu why-setting', purchaseDate: '2025-11-08 20:36', duration: '956 天', description: '成员开月、周度导向会以及填写日导向等功能' }, children: [
        { key: '3-3-1', data: { name: 'T度导向', icon: 'wehanyu why-setting', purchaseDate: '2025-11-08 20:36', duration: '956 天', description: '成员开月、周度导向会以及填写日导向等功能' } },
      ]},
    ]},
  ]);

  readonly flattenedRows = computed<FlatRow[]>(() => {
    const rows: FlatRow[] = [];
    const expanded = new Set(this.expandedKeys());
    const flatten = (nodes: TreeNode[], level: number) => {
      for (const node of nodes) {
        rows.push({ node, level });
        if (node.children?.length && expanded.has(node.key)) {
          flatten(node.children, level + 1);
        }
      }
    };
    flatten(this.treeData(), 0);
    return rows;
  });

  isExpanded(key: string): boolean {
    return this.expandedKeys().includes(key);
  }

  toggleExpand(key: string): void {
    const keys = this.expandedKeys();
    if (keys.includes(key)) {
      this.expandedKeys.set(keys.filter(k => k !== key));
    } else {
      this.expandedKeys.set([...keys, key]);
    }
  }

  getIndent(level: number): number[] {
    return Array.from({ length: level }, (_, i) => i);
  }
}
