import { Component, signal, computed } from '@angular/core';
import { PageHeaderComponent, SearchInputComponent, SplitLayoutComponent, TreeListComponent, ActionBarComponent, ButtonComponent, FilterSelectComponent, type TreeNode } from '../../shared/components';
import { type PageState } from '../../shared/models/page-state';

interface MemberRow {
  name: string;
  avatar: string;
  status: string;
  dept: string;
  position: string;
}

@Component({
  selector: 'app-member-manage',
  standalone: true,
  imports: [PageHeaderComponent, SearchInputComponent, SplitLayoutComponent, TreeListComponent, ActionBarComponent, ButtonComponent, FilterSelectComponent],
  templateUrl: './member-manage.component.html',
  styleUrl: './member-manage.component.scss',
})
export class MemberManageComponent {
  pageState = signal<PageState>('normal');
  searchKeyword = signal('');

  treeItems = signal<TreeNode[]>([
    {
      id: '1', label: '中企云链', expanded: true, children: [
        {
          id: '2', label: '开发部', expanded: true, children: [
            {
              id: '3', label: '前端开发', expanded: true, children: [
                { id: '4', label: '前端开发一组', count: 30 },
              ],
            },
          ],
        },
        { id: '5', label: '产品部', count: 80 },
        { id: '6', label: '运营部', count: 80 },
      ],
    },
  ]);
  activeTreeId = signal('4');

  members = signal<MemberRow[]>([
    { name: '赵莫艳', avatar: '赵', status: '已加入', dept: '前端开发一组', position: '前端工程师' },
    { name: '郑婷雅', avatar: '郑', status: '已加入', dept: '前端开发一组', position: '前端工程师' },
    { name: '冯云', avatar: '冯', status: '未加入', dept: '前端开发一组', position: '前端工程师' },
    { name: '周健', avatar: '周', status: '已加入', dept: '前端开发一组', position: '高级前端工程师' },
    { name: '王凡玄', avatar: '王', status: '已加入', dept: '前端开发一组', position: '前端工程师' },
  ]);

  isLoading = computed(() => this.pageState() === 'loading');

  onSearch(keyword: string) {
    this.searchKeyword.set(keyword);
  }

  onTreeSelect(node: TreeNode) {
    this.activeTreeId.set(node.id);
  }
}
