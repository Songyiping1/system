import { Component, signal, computed } from '@angular/core';
import { PageHeaderComponent, SearchInputComponent, SplitLayoutComponent, TreeListComponent, ActionBarComponent, ButtonComponent, type TreeNode } from '../../shared/components';
import { type PageState } from '../../shared/models/page-state';

interface PositionRow {
  name: string;
  avatar: string;
  jobNo: string;
  email: string;
  phone: string;
}

@Component({
  selector: 'app-position-manage',
  standalone: true,
  imports: [PageHeaderComponent, SearchInputComponent, SplitLayoutComponent, TreeListComponent, ActionBarComponent, ButtonComponent],
  templateUrl: './position-manage.component.html',
  styleUrl: './position-manage.component.scss',
})
export class PositionManageComponent {
  pageState = signal<PageState>('normal');
  searchKeyword = signal('');

  treeItems = signal<TreeNode[]>([
    {
      id: '1', label: '中企云链', expanded: true, children: [
        {
          id: '2', label: 'UE设计师', expanded: true, children: [
            { id: '3', label: '普通员工' },
            { id: '4', label: '总监' },
          ],
        },
        { id: '5', label: '人事专员' },
        { id: '6', label: '前端开发工程师' },
        { id: '7', label: '后端开发工程师' },
        { id: '8', label: '运营专员' },
        { id: '9', label: '产品总监' },
        { id: '10', label: '总经理助理' },
      ],
    },
  ]);
  activeTreeId = signal('3');

  members = signal<PositionRow[]>([
    { name: '赵莫艳', avatar: '赵', jobNo: '10001', email: 'zhaomoyan@example.com', phone: '138****1234' },
    { name: '郑婷雅', avatar: '郑', jobNo: '10023', email: 'zhengtingya@example.com', phone: '139****5678' },
    { name: '冯云', avatar: '冯', jobNo: '10045', email: 'fengyun@example.com', phone: '137****9012' },
    { name: '周健', avatar: '周', jobNo: '10067', email: 'zhoujian@example.com', phone: '136****3456' },
  ]);

  isLoading = computed(() => this.pageState() === 'loading');

  onSearch(keyword: string) {
    this.searchKeyword.set(keyword);
  }

  onTreeSelect(node: TreeNode) {
    this.activeTreeId.set(node.id);
  }
}
