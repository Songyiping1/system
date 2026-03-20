import { Component, signal, computed } from '@angular/core';
import { PageHeaderComponent, SearchInputComponent, SplitLayoutComponent, TreeListComponent, type TreeNode } from '../../shared/components';
import { type PageState } from '../../shared/models/page-state';

interface PermissionRow {
  name: string;
  level: number;
  route: string;
  source: string;
  desc: string;
  expanded?: boolean;
  children?: PermissionRow[];
}

@Component({
  selector: 'app-permission-query',
  standalone: true,
  imports: [PageHeaderComponent, SearchInputComponent, SplitLayoutComponent, TreeListComponent],
  templateUrl: './permission-query.component.html',
  styleUrl: './permission-query.component.scss',
})
export class PermissionQueryComponent {
  pageState = signal<PageState>('normal');
  searchKeyword = signal('');
  selectedPerson = signal('张竞元');

  treeItems = signal<TreeNode[]>([
    {
      id: '1', label: '中企云链', expanded: true, children: [
        {
          id: '2', label: '开发部', expanded: true, children: [
            { id: '3', label: '张竞元' },
            { id: '4', label: '赵莫艳' },
            { id: '5', label: '郑婷雅' },
          ],
        },
        {
          id: '6', label: '产品部', children: [
            { id: '7', label: '冯云' },
            { id: '8', label: '周健' },
          ],
        },
      ],
    },
  ]);
  activeTreeId = signal('3');

  permissionItems = signal<PermissionRow[]>([
    {
      name: '工作台', level: 0, route: '/workbench', source: '角色-主管', desc: '工作台首页', expanded: true, children: [
        { name: '待办事项', level: 1, route: '/workbench/todo', source: '角色-主管', desc: '待办任务列表' },
        { name: '数据看板', level: 1, route: '/workbench/dashboard', source: '角色-总监', desc: '数据统计概览' },
      ],
    },
    {
      name: '通讯录', level: 0, route: '/contacts', source: '角色-主管', desc: '企业通讯录', expanded: true, children: [
        { name: '组织架构', level: 1, route: '/contacts/org', source: '角色-主管', desc: '组织架构管理' },
        { name: '成员管理', level: 1, route: '/contacts/member', source: '直接授权', desc: '成员信息管理' },
      ],
    },
    { name: '审批', level: 0, route: '/approval', source: '角色-主管', desc: '审批流程管理' },
  ]);

  isLoading = computed(() => this.pageState() === 'loading');

  onSearch(keyword: string) {
    this.searchKeyword.set(keyword);
  }

  onTreeSelect(node: TreeNode) {
    this.activeTreeId.set(node.id);
    if (!node.children || node.children.length === 0) {
      this.selectedPerson.set(node.label);
    }
  }

  flattenPermissions(): PermissionRow[] {
    const result: PermissionRow[] = [];
    const flatten = (items: PermissionRow[]) => {
      for (const item of items) {
        result.push(item);
        if (item.expanded && item.children) {
          flatten(item.children);
        }
      }
    };
    flatten(this.permissionItems());
    return result;
  }

  toggleExpand(item: PermissionRow) {
    item.expanded = !item.expanded;
    this.permissionItems.update(items => [...items]);
  }
}
