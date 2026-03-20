import { Component, signal, computed } from '@angular/core';
import { PageHeaderComponent, SearchInputComponent, SplitLayoutComponent, TreeListComponent, type TreeNode } from '../../shared/components';
import { type PageState } from '../../shared/models/page-state';

interface RoleRow {
  name: string;
  avatar: string;
  dept: string;
  jobNo: string;
  scope: string;
}

@Component({
  selector: 'app-role-manage',
  standalone: true,
  imports: [PageHeaderComponent, SearchInputComponent, SplitLayoutComponent, TreeListComponent],
  templateUrl: './role-manage.component.html',
  styleUrl: './role-manage.component.scss',
})
export class RoleManageComponent {
  pageState = signal<PageState>('normal');
  searchKeyword = signal('');

  treeItems = signal<TreeNode[]>([
    {
      id: '1', label: '默认角色', expanded: true, children: [
        { id: '2', label: '部门主管' },
      ],
    },
    {
      id: '3', label: '自定义分组', expanded: true, children: [
        { id: '4', label: '财务' },
        { id: '5', label: '采购' },
        { id: '6', label: 'IT' },
        { id: '7', label: '行政' },
        { id: '8', label: '运营' },
        { id: '9', label: '客服' },
      ],
    },
    {
      id: '10', label: '自定义分组名称', expanded: true, children: [
        { id: '11', label: '主管' },
        { id: '12', label: '高级管理者' },
        { id: '13', label: '科长' },
        { id: '14', label: '总经理' },
      ],
    },
  ]);
  activeTreeId = signal('11');

  members = signal<RoleRow[]>([
    { name: '赵莫艳', avatar: '赵', dept: '前端开发一组', jobNo: '10001', scope: '所在部门' },
    { name: '郑婷雅', avatar: '郑', dept: '产品部', jobNo: '10023', scope: '所在部门' },
    { name: '冯云', avatar: '冯', dept: '运营部', jobNo: '10045', scope: '全公司' },
    { name: '周健', avatar: '周', dept: '开发部', jobNo: '10067', scope: '所在部门及下级部门' },
  ]);

  isLoading = computed(() => this.pageState() === 'loading');

  onSearch(keyword: string) {
    this.searchKeyword.set(keyword);
  }

  onTreeSelect(node: TreeNode) {
    this.activeTreeId.set(node.id);
  }
}
