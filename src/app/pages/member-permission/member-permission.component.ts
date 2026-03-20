import { Component, signal, computed } from '@angular/core';
import { PageHeaderComponent, SearchInputComponent, ActionBarComponent, FilterSelectComponent, TypeBadgeComponent } from '../../shared/components';
import { type PageState } from '../../shared/models/page-state';

interface PermissionRow {
  admin: string;
  adminAvatar: string;
  adminBadge: string;
  dept: string;
  jobNo: string;
  scope: string;
  addedBy: string;
  addedByAvatar: string;
  time: string;
}

@Component({
  selector: 'app-member-permission',
  standalone: true,
  imports: [PageHeaderComponent, SearchInputComponent, ActionBarComponent, FilterSelectComponent, TypeBadgeComponent],
  templateUrl: './member-permission.component.html',
  styleUrl: './member-permission.component.scss',
})
export class MemberPermissionComponent {
  pageState = signal<PageState>('normal');
  searchKeyword = signal('');

  permissionList = signal<PermissionRow[]>([
    { admin: '赵莫艳', adminAvatar: '赵', adminBadge: '主管理员', dept: '前端开发一组', jobNo: '10001', scope: '全公司', addedBy: '系统', addedByAvatar: '系', time: '2025-10-01 09:00' },
    { admin: '郑婷雅', adminAvatar: '郑', adminBadge: '子管理员', dept: '产品部', jobNo: '10023', scope: '所在部门', addedBy: '赵莫艳', addedByAvatar: '赵', time: '2025-10-05 14:30' },
    { admin: '冯云', adminAvatar: '冯', adminBadge: '子管理员', dept: '运营部', jobNo: '10045', scope: '所在部门及下级', addedBy: '赵莫艳', addedByAvatar: '赵', time: '2025-10-08 11:20' },
    { admin: '周健', adminAvatar: '周', adminBadge: '子管理员', dept: '开发部', jobNo: '10067', scope: '所在部门', addedBy: '郑婷雅', addedByAvatar: '郑', time: '2025-10-10 16:45' },
  ]);

  isLoading = computed(() => this.pageState() === 'loading');

  onSearch(keyword: string) {
    this.searchKeyword.set(keyword);
  }
}
