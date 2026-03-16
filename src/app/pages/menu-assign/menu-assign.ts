import { Component, signal, computed } from '@angular/core';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { CheckboxComponent } from '../../shared/components/checkbox/checkbox.component';
import { ChildCountBadgeComponent } from '../../shared/components/child-count-badge/child-count-badge.component';
import { SearchInputComponent } from '../../shared/components/search-input/search-input.component';
import { RoleListComponent } from '../../shared/components/role-list/role-list.component';
import { RoleGroup, TreeNode } from '../../shared/models';

interface FlatRow {
  node: TreeNode;
  level: number;
}

@Component({
  selector: 'app-menu-assign',
  imports: [PageHeaderComponent, ButtonComponent, CheckboxComponent, ChildCountBadgeComponent, SearchInputComponent, RoleListComponent],
  templateUrl: './menu-assign.html',
  styleUrl: './menu-assign.scss',
})
export class MenuAssign {
  readonly searchValue = signal('');
  readonly selectedRoleKeys = signal<string[]>(['director', 'supervisor']);

  readonly roleGroups = signal<RoleGroup[]>([
    {
      title: '默认',
      expanded: true,
      roles: [
        { key: 'dept-manager', label: '部门主管' },
        { key: 'director', label: '总监' },
      ],
    },
    {
      title: '自定义分组名称（非定义分组）',
      expanded: true,
      roles: [
        { key: 'finance', label: '财务' },
        { key: 'purchase', label: '采购' },
        { key: 'it', label: 'IT' },
        { key: 'admin-office', label: '行政' },
        { key: 'operation', label: '运营' },
        { key: 'service', label: '管理' },
      ],
    },
    {
      title: '自定义分组名称（非定义分组）',
      expanded: true,
      roles: [
        { key: 'supervisor', label: '主管' },
        { key: 'senior-manager', label: '高级管理者' },
        { key: 'section-chief', label: '科长' },
      ],
    },
  ]);

  readonly selectedRoleLabels = computed(() => {
    const keys = this.selectedRoleKeys();
    const labels: string[] = [];
    for (const group of this.roleGroups()) {
      for (const role of group.roles) {
        if (keys.includes(role.key)) labels.push(role.label);
      }
    }
    return labels;
  });

  readonly selectedRoleLabelText = computed(() => this.selectedRoleLabels().join('、'));

  // Right side tree table
  readonly checkedKeys = signal<string[]>(['1', '2', '3', '3-1', '3-1-1', '3-1-2', '3-2', '4', '4-1', '5', '5-1', '6', '6-1', '7', '7-1']);
  readonly expandedMenuKeys = signal<string[]>(['3', '3-1']);

  readonly menuTreeData = signal<TreeNode[]>([
    { key: '1', data: { name: 'T度导向', tags: ['角色'], description: '这是一段描述' } },
    { key: '2', data: { name: '项目管理', tags: ['角色', '主管'], description: '这是一段描述' }, children: [
      { key: '2-1', data: { name: 'T度导向', tags: ['角色'], description: '这是一段描述' } },
    ]},
    { key: '3', data: { name: 'T度导向', tags: ['主管'], description: '这是一段描述' }, children: [
      { key: '3-1', data: { name: 'T度导向', tags: ['服务分配'], description: '这是一段描述' }, children: [
        { key: '3-1-1', data: { name: 'T度导向', tags: ['角色'], description: '这是一段描述' } },
        { key: '3-1-2', data: { name: 'T度导向', tags: ['主管', '角色'], description: '这是一段描述' } },
      ]},
      { key: '3-2', data: { name: 'T度导向', tags: ['主管', '角色'], description: '这是一段描述' } },
    ]},
    { key: '4', data: { name: 'T度导向', tags: ['角色'], description: '这是一段描述' }, children: [
      { key: '4-1', data: { name: 'T度导向', tags: ['角色'], description: '这是一段描述' } },
    ]},
    { key: '5', data: { name: 'T度导向', tags: ['主管', '角色'], description: '这是一段描述' }, children: [
      { key: '5-1', data: { name: 'T度导向', tags: ['主管', '角色'], description: '这是一段描述' } },
    ]},
    { key: '6', data: { name: 'T度导向', tags: ['主管', '角色'], description: '这是一段描述' }, children: [
      { key: '6-1', data: { name: 'T度导向', tags: ['主管', '角色'], description: '这是一段描述' } },
    ]},
    { key: '7', data: { name: 'T度导向', tags: [], description: '这是一段描述' }, children: [
      { key: '7-1', data: { name: 'T度导向', tags: ['这是一段描述'], description: '这是一段描述' } },
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

  onRoleSelectionChange(keys: string[]): void {
    this.selectedRoleKeys.set(keys);
  }

  clearRoleSelection(): void {
    this.selectedRoleKeys.set([]);
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
    const all = this.flattenedRows();
    return all.length > 0 && all.every(r => this.checkedKeys().includes(r.node.key));
  });

  readonly isIndeterminate = computed(() => {
    const all = this.flattenedRows();
    const checked = all.filter(r => this.checkedKeys().includes(r.node.key));
    return checked.length > 0 && checked.length < all.length;
  });

  toggleSelectAll(): void {
    if (this.isAllChecked()) {
      this.checkedKeys.set([]);
    } else {
      this.checkedKeys.set(this.flattenedRows().map(r => r.node.key));
    }
  }

  getIndent(level: number): number[] {
    return Array.from({ length: level }, (_, i) => i);
  }
}
