import { Component, signal, computed } from '@angular/core';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { SearchInputComponent } from '../../shared/components/search-input/search-input.component';
import { RoleListComponent } from '../../shared/components/role-list/role-list.component';
import { TreeTableComponent } from '../../shared/components/tree-table/tree-table.component';
import { ColumnDef, TreeNode, RoleGroup } from '../../shared/models';

@Component({
  selector: 'app-menu-assign-new',
  imports: [ButtonComponent, SearchInputComponent, RoleListComponent, TreeTableComponent],
  templateUrl: './menu-assign-new.html',
  styleUrl: './menu-assign-new.scss',
})
export class MenuAssignNew {
  readonly searchValue = signal('');
  readonly selectedRoleKeys = signal<string[]>(['finance']);

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
      title: '自定义分组名称',
      expanded: true,
      roles: [
        { key: 'finance', label: '财务', badge: '新建待分配' },
        { key: 'procurement', label: '采购' },
        { key: 'it', label: 'IT' },
        { key: 'admin', label: '行政' },
        { key: 'operations', label: '运营' },
        { key: 'customer-service', label: '客服' },
      ],
    },
    {
      title: '自定义分组名称2',
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
        if (keys.includes(role.key)) {
          labels.push(role.label);
        }
      }
    }
    return labels;
  });

  readonly showActions = computed(() => this.selectedRoleKeys().length > 0 && this.treeSelectedKeys().length > 0);

  readonly treeColumns = signal<ColumnDef[]>([
    { key: 'name', label: '名称', width: '290px' },
    { key: 'source', label: '权限归属' },
    { key: 'description', label: '描述' },
  ]);

  readonly treeExpandedKeys = signal<string[]>(['menu-1', 'menu-2', 'menu-4']);
  readonly treeSelectedKeys = signal<string[]>(['menu-1', 'menu-2', 'menu-2-1', 'menu-2-2', 'menu-4', 'menu-4-1']);

  readonly treeData = signal<TreeNode[]>([
    {
      key: 'menu-1',
      data: { name: 'T度导向', source: '总监', description: '成员开月、周度导向会以及填写日导向等功能' },
    },
    {
      key: 'menu-2',
      data: { name: '项目管理', source: '主管', description: '项目进度管理与追踪' },
      children: [
        { key: 'menu-2-1', data: { name: '项目列表', source: '总监', description: '查看全部项目列表' } },
        { key: 'menu-2-2', data: { name: '项目统计', source: '主管', description: '项目数据统计分析' } },
      ],
    },
    {
      key: 'menu-3',
      data: { name: '智能人事', source: '', description: '人事管理功能模块' },
    },
    {
      key: 'menu-4',
      data: { name: 'T度导向', source: '总监', description: '成员开月、周度导向会以及填写日导向等功能' },
      children: [
        {
          key: 'menu-4-1',
          data: { name: '子菜单一', source: '主管', description: '子菜单功能描述' },
          children: [
            { key: 'menu-4-1-1', data: { name: '三级菜单', source: '', description: '三级菜单描述' } },
          ],
        },
        { key: 'menu-4-2', data: { name: '子菜单二', source: '', description: '子菜单功能描述' } },
      ],
    },
    {
      key: 'menu-5',
      data: { name: '文档库', source: '', description: '文档资料管理' },
    },
    {
      key: 'menu-6',
      data: { name: '日程', source: '', description: '日程安排与管理' },
    },
    {
      key: 'menu-7',
      data: { name: '招聘', source: '', description: '招聘流程管理' },
    },
    {
      key: 'menu-8',
      data: { name: '薪酬管理', source: '', description: '薪酬体系管理' },
    },
  ]);

  onRoleSelectionChange(keys: string[]): void {
    this.selectedRoleKeys.set(keys);
  }

  clearSelection(): void {
    this.selectedRoleKeys.set([]);
  }

  onTreeExpandedKeysChange(keys: string[]): void {
    this.treeExpandedKeys.set(keys);
  }

  onTreeSelectedKeysChange(keys: string[]): void {
    this.treeSelectedKeys.set(keys);
  }

  cancelTreeSelection(): void {
    this.treeSelectedKeys.set([]);
  }
}
