import { Component, signal, computed } from '@angular/core';
import { PersonTreeComponent } from '../../shared/components/person-tree/person-tree.component';
import { TreeTableComponent } from '../../shared/components/tree-table/tree-table.component';
import { SearchInputComponent } from '../../shared/components/search-input/search-input.component';
import { ColumnDef, TreeNode, PersonTreeNode, BadgeVariant } from '../../shared/models';

@Component({
  selector: 'app-permission-query',
  imports: [PersonTreeComponent, TreeTableComponent, SearchInputComponent],
  templateUrl: './permission-query.html',
  styleUrl: './permission-query.scss',
})
export class PermissionQuery {
  readonly searchValue = signal('');
  readonly selectedPersonKeys = signal<string[]>(['zhao-yuyan']);

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
    return findLabel(this.personNodes()) || '未选择';
  });

  readonly permissionColumns = signal<ColumnDef[]>([
    { key: 'name', label: '菜单名称', width: '240px' },
    { key: 'type', label: '权限类型' },
    { key: 'status', label: '状态' },
  ]);

  readonly permissionExpandedKeys = signal<string[]>(['menu-1', 'menu-2', 'menu-3']);

  readonly permissionData = signal<TreeNode[]>([
    {
      key: 'menu-1',
      data: { name: '工作台', type: '菜单权限', status: '已启用', statusVariant: 'success' },
      children: [
        { key: 'menu-1-1', data: { name: '工作概览', type: '页面权限', status: '已启用', statusVariant: 'success' } },
        { key: 'menu-1-2', data: { name: '待办事项', type: '页面权限', status: '已启用', statusVariant: 'success' } },
        { key: 'menu-1-3', data: { name: '数据看板', type: '页面权限', status: '未启用', statusVariant: 'default' } },
      ],
    },
    {
      key: 'menu-2',
      data: { name: '项目管理', type: '菜单权限', status: '已启用', statusVariant: 'success' },
      children: [
        { key: 'menu-2-1', data: { name: '项目列表', type: '页面权限', status: '已启用', statusVariant: 'success' } },
        {
          key: 'menu-2-2',
          data: { name: '项目统计', type: '页面权限', status: '已启用', statusVariant: 'success' },
          children: [
            { key: 'menu-2-2-1', data: { name: '统计详情', type: '操作权限', status: '已启用', statusVariant: 'success' } },
            { key: 'menu-2-2-2', data: { name: '导出报表', type: '操作权限', status: '未启用', statusVariant: 'default' } },
          ],
        },
        { key: 'menu-2-3', data: { name: '任务看板', type: '页面权限', status: '未启用', statusVariant: 'default' } },
      ],
    },
    {
      key: 'menu-3',
      data: { name: '智能人事', type: '菜单权限', status: '已启用', statusVariant: 'success' },
      children: [
        { key: 'menu-3-1', data: { name: '员工花名册', type: '页面权限', status: '已启用', statusVariant: 'success' } },
        { key: 'menu-3-2', data: { name: '考勤管理', type: '页面权限', status: '未启用', statusVariant: 'default' } },
        { key: 'menu-3-3', data: { name: '薪酬管理', type: '页面权限', status: '未启用', statusVariant: 'default' } },
      ],
    },
    { key: 'menu-4', data: { name: '文档库', type: '菜单权限', status: '已启用', statusVariant: 'success' } },
    { key: 'menu-5', data: { name: '日程', type: '菜单权限', status: '未启用', statusVariant: 'default' } },
    { key: 'menu-6', data: { name: '审批中心', type: '菜单权限', status: '已启用', statusVariant: 'success' } },
  ]);

  onPersonSelectionChange(keys: string[]): void {
    this.selectedPersonKeys.set(keys);
  }

  onPermissionExpandedKeysChange(keys: string[]): void {
    this.permissionExpandedKeys.set(keys);
  }

  getStatusVariant(variant: string): BadgeVariant {
    return (variant as BadgeVariant) || 'default';
  }
}
