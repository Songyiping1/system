import { Component, signal, computed } from '@angular/core';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { DataTableComponent } from '../../shared/components/data-table/data-table.component';
import { CheckboxComponent } from '../../shared/components/checkbox/checkbox.component';
import { ChildCountBadgeComponent } from '../../shared/components/child-count-badge/child-count-badge.component';
import { ColumnDef, CompanyTreeNode } from '../../shared/models';

@Component({
  selector: 'app-menu-assign',
  imports: [PageHeaderComponent, ButtonComponent, DataTableComponent, CheckboxComponent, ChildCountBadgeComponent],
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
    { key: 'painting', label: 'Painting' },
    { key: 'minico', label: 'miniCo', childCount: 2 },
    { key: 'huatong', label: '华通电力', childCount: 2 },
  ]);

  readonly assignColumns = signal<ColumnDef[]>([
    { key: 'name', label: '名称' },
    { key: 'icon', label: 'icon' },
    { key: 'purchaseDate', label: '购买时间' },
    { key: 'duration', label: '使用期限(天)' },
    { key: 'description', label: '描述' },
  ]);

  readonly assignRows = signal([
    { key: '1', name: 'T度导向', icon: 'wehanyu why-setting', purchaseDate: '2025-11-19', duration: '365 天', description: '成员开月、周度导向会以及填写日导向等功能', checked: true, disabled: false, childCount: 0 },
    { key: '2', name: '项目管理', icon: 'wehanyu why-setting', purchaseDate: '2025-11-19', duration: '永久', description: '成员开月、周度导向会以及填写日导向等功能', checked: true, disabled: false, childCount: 2 },
    { key: '3', name: 'T度导向', icon: 'wehanyu why-setting', purchaseDate: '2025-11-19', duration: '1056 天', description: '成员开月、周度导向会以及填写日导向等功能', checked: true, disabled: false, childCount: 2 },
    { key: '4', name: 'T度导向', icon: 'wehanyu why-setting', purchaseDate: '2025-11-19', duration: '35 天', description: '成员开月、周度导向会以及填写日导向等功能', checked: false, disabled: false, childCount: 2 },
    { key: '5', name: 'T度导向', icon: 'wehanyu why-setting', purchaseDate: '2025-11-19', duration: '65 天', description: '成员开月、周度导向会以及填写日导向等功能', checked: false, disabled: false, childCount: 0 },
    { key: '6', name: 'T度导向', icon: 'wehanyu why-setting', purchaseDate: '2025-11-19', duration: '6548 天', description: '成员开月、周度导向会以及填写日导向等功能', checked: false, disabled: false, childCount: 0 },
    { key: '7', name: 'T度导向', icon: 'wehanyu why-setting', purchaseDate: '2025-11-19', duration: '956 天', description: '成员开月、周度导向会以及填写日导向等功能', checked: false, disabled: false, childCount: 2 },
    { key: '8', name: 'T度导向', icon: 'wehanyu why-setting', purchaseDate: '-', duration: '未开通', description: '成员开月、周度导向会以及填写日导向等功能', checked: false, disabled: true, childCount: 2 },
    { key: '9', name: 'T度导向', icon: 'wehanyu why-setting', purchaseDate: '-', duration: '未开通', description: '成员开月、周度导向会以及填写日导向等功能', checked: false, disabled: true, childCount: 2 },
    { key: '10', name: 'T度导向', icon: 'wehanyu why-setting', purchaseDate: '-', duration: '未开通', description: '成员开月、周度导向会以及填写日导向等功能', checked: false, disabled: true, childCount: 2 },
    { key: '11', name: 'T度导向', icon: 'wehanyu why-setting', purchaseDate: '-', duration: '未开通', description: '成员开月、周度导向会以及填写日导向等功能', checked: false, disabled: true, childCount: 2 },
    { key: '12', name: 'T度导向', icon: 'wehanyu why-setting', purchaseDate: '-', duration: '未开通', description: '成员开月、周度导向会以及填写日导向等功能', checked: false, disabled: true, childCount: 2 },
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
}
