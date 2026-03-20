import { Component, signal, computed } from '@angular/core';
import { PageHeaderComponent, ActionBarComponent, FilterSelectComponent } from '../../shared/components';
import { type PageState } from '../../shared/models/page-state';

interface ChangeRow {
  target: string;
  targetAvatar: string;
  operator: string;
  operatorAvatar: string;
  dept: string;
  eventType: string;
  eventDesc: string;
  time: string;
}

@Component({
  selector: 'app-member-permission-change',
  standalone: true,
  imports: [PageHeaderComponent, ActionBarComponent, FilterSelectComponent],
  templateUrl: './member-permission-change.component.html',
  styleUrl: './member-permission-change.component.scss',
})
export class MemberPermissionChangeComponent {
  pageState = signal<PageState>('normal');

  changeList = signal<ChangeRow[]>([
    { target: '王凡玄', targetAvatar: '王', operator: '赵莫艳', operatorAvatar: '赵', dept: '前端开发一组', eventType: '添加角色', eventDesc: '添加角色「主管」', time: '2025-11-06 14:30' },
    { target: '郑婷雅', targetAvatar: '郑', operator: '赵莫艳', operatorAvatar: '赵', dept: '产品部', eventType: '移除角色', eventDesc: '移除角色「运营」', time: '2025-11-05 09:15' },
    { target: '冯云', targetAvatar: '冯', operator: '周健', operatorAvatar: '周', dept: '运营部', eventType: '修改管理范围', eventDesc: '管理范围由「所在部门」变更为「全公司」', time: '2025-11-04 16:45' },
    { target: '周健', targetAvatar: '周', operator: '赵莫艳', operatorAvatar: '赵', dept: '开发部', eventType: '添加管理员', eventDesc: '添加为子管理员', time: '2025-11-03 11:20' },
  ]);

  isLoading = computed(() => this.pageState() === 'loading');
}
