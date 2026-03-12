import { Component, signal, computed } from '@angular/core';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { SearchInputComponent } from '../../shared/components/search-input/search-input.component';
import { PersonTreeComponent } from '../../shared/components/person-tree/person-tree.component';
import { DataTableComponent } from '../../shared/components/data-table/data-table.component';
import { CheckboxComponent } from '../../shared/components/checkbox/checkbox.component';
import { ColumnDef, PersonTreeNode } from '../../shared/models';

@Component({
  selector: 'app-admin-assign',
  imports: [ButtonComponent, SearchInputComponent, PersonTreeComponent, DataTableComponent, CheckboxComponent],
  templateUrl: './admin-assign.html',
  styleUrl: './admin-assign.scss',
})
export class AdminAssign {
  readonly searchValue = signal('');
  readonly selectedPersonKeys = signal<string[]>(['zhao-yuyan']);
  readonly collapseAll = signal(false);

  readonly personNodes = signal<PersonTreeNode[]>([
    {
      key: 'company',
      label: '中企云链（北京）信息科技有限公司',
      icon: 'company',
      iconColor: '#2e67f4',
      iconText: '中',
      children: [
        {
          key: 'dev-dept',
          label: '开发部',
          childCount: 2,
          children: [
            {
              key: 'frontend',
              label: '前端开发',
              childCount: 2,
              children: [
                {
                  key: 'frontend-group1',
                  label: '前端开发一组',
                  childCount: 30,
                  children: [
                    { key: 'zhao-yuyan', label: '赵萸艳', avatar: '' },
                    { key: 'zheng-tingya', label: '郑婷雅', avatar: '' },
                    { key: 'feng-yun', label: '冯云', avatar: '' },
                    { key: 'zhou-jin', label: '周琎', avatar: '' },
                  ],
                },
              ],
            },
          ],
        },
        { key: 'backend', label: '后端开发', childCount: 2 },
        { key: 'product-dept', label: '产品部', childCount: 80 },
        { key: 'ops-dept', label: '运营部', childCount: 80 },
        { key: 'defense-dept', label: '国防部', childCount: 80 },
        { key: 'police-dept', label: '公安部', childCount: 80 },
      ],
    },
  ]);

  readonly selectedPersonLabel = computed(() => {
    const keys = this.selectedPersonKeys();
    if (keys.length === 0) return '未选择';
    const findLabel = (nodes: PersonTreeNode[]): string => {
      for (const node of nodes) {
        if (keys.includes(node.key)) return node.label;
        if (node.children) {
          const found = findLabel(node.children);
          if (found) return found;
        }
      }
      return '';
    };
    return findLabel(this.personNodes());
  });

  readonly assignColumns = signal<ColumnDef[]>([
    { key: 'name', label: '业务名称' },
    { key: 'purchaseDate', label: '购买时间' },
    { key: 'duration', label: '使用期限（天）' },
    { key: 'description', label: '描述' },
  ]);

  readonly assignRows = signal([
    { key: '1', name: 'T度导向', purchaseDate: '2025-11-19', duration: '365 天', description: '成员开月、周度导向会以及填写日导向等功能', checked: true, disabled: false },
    { key: '2', name: '项目管理', purchaseDate: '2025-11-19', duration: '永久', description: '项目进度管理与追踪', checked: true, disabled: false },
    { key: '3', name: '智能人事', purchaseDate: '2025-11-19', duration: '1056 天', description: '人事管理功能模块', checked: true, disabled: false },
    { key: '4', name: '文档库', purchaseDate: '2025-11-19', duration: '35 天', description: '文档资料管理', checked: false, disabled: false },
    { key: '5', name: '日程', purchaseDate: '2025-11-19', duration: '65 天', description: '日程安排与管理', checked: false, disabled: false },
    { key: '6', name: '招聘', purchaseDate: '2025-11-19', duration: '6548 天', description: '招聘流程管理', checked: false, disabled: false },
    { key: '7', name: '薪酬管理', purchaseDate: '2025-11-19', duration: '956 天', description: '薪酬体系管理', checked: false, disabled: false },
    { key: '8', name: '考勤管理', purchaseDate: '-', duration: '未开通', description: '考勤打卡与统计', checked: false, disabled: true },
    { key: '9', name: '管理后台', purchaseDate: '-', duration: '未开通', description: '系统管理后台', checked: false, disabled: true },
  ]);

  onPersonSelectionChange(keys: string[]): void {
    this.selectedPersonKeys.set(keys);
  }

  toggleCollapseAll(): void {
    this.collapseAll.set(!this.collapseAll());
  }
}
