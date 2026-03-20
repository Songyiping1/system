import { Component, signal, computed } from '@angular/core';
import { PageHeaderComponent, SearchInputComponent, SplitLayoutComponent, TreeListComponent, ActionBarComponent, ButtonComponent, TypeBadgeComponent, type TreeNode } from '../../shared/components';
import { type PageState } from '../../shared/models/page-state';

interface MenuRow {
  name: string;
  level: number;
  permissions: string[];
  desc: string;
  expanded?: boolean;
  children?: MenuRow[];
}

@Component({
  selector: 'app-user-menu-assign',
  standalone: true,
  imports: [PageHeaderComponent, SearchInputComponent, SplitLayoutComponent, TreeListComponent, ActionBarComponent, ButtonComponent, TypeBadgeComponent],
  templateUrl: './user-menu-assign.component.html',
  styleUrl: './user-menu-assign.component.scss',
})
export class UserMenuAssignComponent {
  pageState = signal<PageState>('normal');
  searchKeyword = signal('');
  selectedRoles = signal<string[]>(['总监', '主管']);

  treeItems = signal<TreeNode[]>([
    {
      id: '1', label: '默认', expanded: true, children: [
        { id: '2', label: '部门主管' },
        { id: '3', label: '总监' },
      ],
    },
    {
      id: '4', label: '自定义分组', expanded: true, children: [
        { id: '5', label: '财务' },
        { id: '6', label: '采购' },
        { id: '7', label: 'IT' },
        { id: '8', label: '行政' },
        { id: '9', label: '运营' },
        { id: '10', label: '客服' },
      ],
    },
    {
      id: '11', label: '自定义分组名称', expanded: true, children: [
        { id: '12', label: '主管' },
        { id: '13', label: '高级管理者' },
        { id: '14', label: '科长' },
      ],
    },
  ]);
  activeTreeId = signal('3');

  menuItems = signal<MenuRow[]>([
    { name: '工作台', level: 0, permissions: ['角色'], desc: '工作台首页', expanded: true, children: [
      { name: '待办事项', level: 1, permissions: ['角色', '总监'], desc: '待办任务列表' },
      { name: '数据看板', level: 1, permissions: ['总监'], desc: '数据统计概览' },
    ]},
    { name: '通讯录', level: 0, permissions: ['角色'], desc: '企业通讯录管理', expanded: true, children: [
      { name: '组织架构', level: 1, permissions: ['角色', '总监'], desc: '组织架构管理' },
      { name: '成员管理', level: 1, permissions: ['角色'], desc: '成员信息管理' },
    ]},
    { name: '审批', level: 0, permissions: ['角色', '总监'], desc: '审批流程管理' },
  ]);

  isLoading = computed(() => this.pageState() === 'loading');

  onSearch(keyword: string) {
    this.searchKeyword.set(keyword);
  }

  onTreeSelect(node: TreeNode) {
    this.activeTreeId.set(node.id);
  }

  removeRole(role: string) {
    this.selectedRoles.update(roles => roles.filter(r => r !== role));
  }

  flattenMenuItems(): MenuRow[] {
    const result: MenuRow[] = [];
    const flatten = (items: MenuRow[]) => {
      for (const item of items) {
        result.push(item);
        if (item.expanded && item.children) {
          flatten(item.children);
        }
      }
    };
    flatten(this.menuItems());
    return result;
  }

  toggleExpand(item: MenuRow) {
    item.expanded = !item.expanded;
    this.menuItems.update(items => [...items]);
  }
}
