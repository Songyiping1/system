import { Component, signal, computed } from '@angular/core';
import { PageHeaderComponent, SearchInputComponent, SplitLayoutComponent, TreeListComponent, ActionBarComponent, ButtonComponent, type TreeNode } from '../../shared/components';
import { type PageState } from '../../shared/models/page-state';

interface BusinessRow {
  name: string;
  buyDate: string;
  period: number;
  desc: string;
}

@Component({
  selector: 'app-admin-assign',
  standalone: true,
  imports: [PageHeaderComponent, SearchInputComponent, SplitLayoutComponent, TreeListComponent, ActionBarComponent, ButtonComponent],
  templateUrl: './admin-assign.component.html',
  styleUrl: './admin-assign.component.scss',
})
export class AdminAssignComponent {
  pageState = signal<PageState>('normal');
  searchKeyword = signal('');
  selectedMember = signal('赵莫艳');

  treeItems = signal<TreeNode[]>([
    {
      id: '1', label: '中企云链', expanded: true, children: [
        {
          id: '2', label: '开发部', expanded: true, children: [
            {
              id: '3', label: '前端开发', expanded: true, children: [
                {
                  id: '4', label: '前端开发一组', count: 30, expanded: true, children: [
                    { id: '5', label: '赵莫艳' },
                    { id: '6', label: '郑婷雅' },
                    { id: '7', label: '冯云' },
                    { id: '8', label: '周健' },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ]);
  activeTreeId = signal('5');

  businessItems = signal<BusinessRow[]>([
    { name: '智能办公', buyDate: '2025-01-15', period: 365, desc: '智能办公基础套件' },
    { name: '人事管理', buyDate: '2025-02-01', period: 365, desc: '人事信息管理系统' },
    { name: '财务管理', buyDate: '2025-03-10', period: 180, desc: '财务报表与审批' },
    { name: '项目管理', buyDate: '2025-04-20', period: 365, desc: '项目进度与资源管理' },
  ]);

  isLoading = computed(() => this.pageState() === 'loading');

  onSearch(keyword: string) {
    this.searchKeyword.set(keyword);
  }

  onTreeSelect(node: TreeNode) {
    this.activeTreeId.set(node.id);
    if (!node.children || node.children.length === 0) {
      this.selectedMember.set(node.label);
    }
  }
}
