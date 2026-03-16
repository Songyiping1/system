import { Component, signal, computed } from '@angular/core';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { CheckboxComponent } from '../../shared/components/checkbox/checkbox.component';
import { ChildCountBadgeComponent } from '../../shared/components/child-count-badge/child-count-badge.component';
import { CompanyTreeNode, TreeNode } from '../../shared/models';

interface FlatRow {
  node: TreeNode;
  level: number;
}

@Component({
  selector: 'app-menu-assign',
  imports: [PageHeaderComponent, ButtonComponent, CheckboxComponent, ChildCountBadgeComponent],
  templateUrl: './menu-assign.html',
  styleUrl: './menu-assign.scss',
})
export class MenuAssign {
  readonly companySearchValue = signal('');
  readonly selectedCompanyKey = signal('tianchen');
  readonly expandedCompanyKeys = signal<string[]>(['tianchen']);

  readonly companies = signal<CompanyTreeNode[]>([
    { key: 'huihua', label: '惠华集团', childCount: 2 },
    { key: 'runtong', label: '润通求本', childCount: 2 },
    { key: 'tianchen', label: '天诚', childCount: 2, children: [
      { key: 'haolin', label: '浩霖集团', childCount: 2 },
      { key: 'ace', label: 'ACE Studio' },
      { key: 'foco', label: 'FOCO' },
    ]},
    { key: 'tiange', label: '天格环基', childCount: 2 },
    { key: 'painting', label: 'Painting', childCount: 2 },
    { key: 'minico', label: 'miniCo', childCount: 2 },
    { key: 'huatong', label: '华通电力', childCount: 2 },
  ]);

  readonly selectedCompanyLabel = computed(() => {
    const findLabel = (nodes: CompanyTreeNode[]): string => {
      for (const node of nodes) {
        if (node.key === this.selectedCompanyKey()) return node.label;
        if (node.children) {
          const found = findLabel(node.children);
          if (found) return found;
        }
      }
      return '';
    };
    return findLabel(this.companies());
  });

  // Right side tree table
  readonly checkedKeys = signal<string[]>(['1', '2', '3']);
  readonly expandedMenuKeys = signal<string[]>(['3']);

  readonly menuTreeData = signal<TreeNode[]>([
    { key: '1', data: { name: 'T度导向', icon: 'wehanyu why-setting', purchaseDate: '2025-11-19', duration: '365 天', description: '成员开月、周度导向会以及填写日导向等功能' } },
    { key: '2', data: { name: '项目管理', icon: 'wehanyu why-setting', purchaseDate: '2025-11-19', duration: '永久', description: '成员开月、周度导向会以及填写日导向等功能' }, children: [
      { key: '2-1', data: { name: 'T度导向', icon: 'wehanyu why-setting', purchaseDate: '2025-11-19', duration: '35 天', description: '成员开月、周度导向会以及填写日导向等功能' } },
    ]},
    { key: '3', data: { name: 'T度导向', icon: 'wehanyu why-setting', purchaseDate: '2025-11-19', duration: '1056 天', description: '成员开月、周度导向会以及填写日导向等功能' }, children: [
      { key: '3-1', data: { name: 'T度导向', icon: 'wehanyu why-setting', purchaseDate: '2025-11-19', duration: '35 天', description: '成员开月、周度导向会以及填写日导向等功能' }, children: [
        { key: '3-1-1', data: { name: 'T度导向', icon: 'wehanyu why-setting', purchaseDate: '2025-11-19', duration: '65 天', description: '成员开月、周度导向会以及填写日导向等功能' } },
        { key: '3-1-2', data: { name: 'T度导向', icon: 'wehanyu why-setting', purchaseDate: '2025-11-19', duration: '6548 天', description: '成员开月、周度导向会以及填写日导向等功能' } },
      ]},
      { key: '3-2', data: { name: 'T度导向', icon: 'wehanyu why-setting', purchaseDate: '2025-11-19', duration: '956 天', description: '成员开月、周度导向会以及填写日导向等功能' }, children: [
        { key: '3-2-1', data: { name: 'T度导向', icon: 'wehanyu why-setting', purchaseDate: '2025-11-19', duration: '956 天', description: '成员开月、周度导向会以及填写日导向等功能' } },
      ]},
    ]},
    { key: '4', data: { name: 'T度导向', icon: 'wehanyu why-setting', purchaseDate: '-', duration: '未开通', description: '成员开月、周度导向会以及填写日导向等功能', disabled: true }, children: [
      { key: '4-1', data: { name: 'T度导向', icon: 'wehanyu why-setting', purchaseDate: '-', duration: '未开通', description: '成员开月、周度导向会以及填写日导向等功能', disabled: true } },
    ]},
    { key: '5', data: { name: 'T度导向', icon: 'wehanyu why-setting', purchaseDate: '-', duration: '未开通', description: '成员开月、周度导向会以及填写日导向等功能', disabled: true }, children: [
      { key: '5-1', data: { name: 'T度导向', icon: 'wehanyu why-setting', purchaseDate: '-', duration: '未开通', description: '成员开月、周度导向会以及填写日导向等功能', disabled: true } },
    ]},
    { key: '6', data: { name: 'T度导向', icon: 'wehanyu why-setting', purchaseDate: '-', duration: '未开通', description: '成员开月、周度导向会以及填写日导向等功能', disabled: true }, children: [
      { key: '6-1', data: { name: 'T度导向', icon: 'wehanyu why-setting', purchaseDate: '-', duration: '未开通', description: '成员开月、周度导向会以及填写日导向等功能', disabled: true } },
    ]},
    { key: '7', data: { name: 'T度导向', icon: 'wehanyu why-setting', purchaseDate: '-', duration: '未开通', description: '成员开月、周度导向会以及填写日导向等功能', disabled: true }, children: [
      { key: '7-1', data: { name: 'T度导向', icon: 'wehanyu why-setting', purchaseDate: '-', duration: '未开通', description: '成员开月、周度导向会以及填写日导向等功能', disabled: true } },
    ]},
  ]);

  readonly flattenedRows = computed<FlatRow[]>(() => {
    const rows: FlatRow[] = [];
    const expanded = new Set(this.expandedMenuKeys());
    const flatten = (nodes: TreeNode[], level: number) => {
      for (const node of nodes) {
        rows.push({ node, level });
        if (node.children?.length && expanded.has(node.key)) {
          flatten(node.children, level + 1);
        }
      }
    };
    flatten(this.menuTreeData(), 0);
    return rows;
  });

  isExpanded(key: string): boolean {
    return this.expandedCompanyKeys().includes(key);
  }

  toggleExpand(key: string): void {
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

  isMenuExpanded(key: string): boolean {
    return this.expandedMenuKeys().includes(key);
  }

  toggleMenuExpand(key: string): void {
    const keys = this.expandedMenuKeys();
    if (keys.includes(key)) {
      this.expandedMenuKeys.set(keys.filter(k => k !== key));
    } else {
      this.expandedMenuKeys.set([...keys, key]);
    }
  }

  isChecked(key: string): boolean {
    return this.checkedKeys().includes(key);
  }

  toggleCheck(key: string): void {
    const keys = this.checkedKeys();
    if (keys.includes(key)) {
      this.checkedKeys.set(keys.filter(k => k !== key));
    } else {
      this.checkedKeys.set([...keys, key]);
    }
  }

  readonly isAllChecked = computed(() => {
    const selectable = this.flattenedRows().filter(r => !r.node.data['disabled']);
    return selectable.length > 0 && selectable.every(r => this.checkedKeys().includes(r.node.key));
  });

  toggleSelectAll(): void {
    if (this.isAllChecked()) {
      this.checkedKeys.set([]);
    } else {
      const allKeys = this.flattenedRows()
        .filter(r => !r.node.data['disabled'])
        .map(r => r.node.key);
      this.checkedKeys.set(allKeys);
    }
  }

  getIndent(level: number): number[] {
    return Array.from({ length: level }, (_, i) => i);
  }
}
