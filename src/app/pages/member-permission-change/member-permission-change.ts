import { Component, signal } from '@angular/core';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { ActionBarComponent } from '../../shared/components/action-bar/action-bar.component';
import { SearchInputComponent } from '../../shared/components/search-input/search-input.component';
import { AvatarComponent } from '../../shared/components/avatar/avatar.component';
import { TypeBadgeComponent } from '../../shared/components/type-badge/type-badge.component';
import { BadgeVariant } from '../../shared/models';

interface ChangeRow {
  key: string;
  memberName: string;
  changeType: string;
  changeTypeVariant: BadgeVariant;
  changeMenu: string;
  before: string;
  after: string;
  operator: string;
  changeTime: string;
}

@Component({
  selector: 'app-member-permission-change',
  imports: [PageHeaderComponent, ActionBarComponent, SearchInputComponent, AvatarComponent, TypeBadgeComponent],
  templateUrl: './member-permission-change.html',
  styleUrl: './member-permission-change.scss',
})
export class MemberPermissionChange {
  readonly searchValue = signal('');
  readonly dateRange = signal('');

  readonly rows = signal<ChangeRow[]>([
    { key: '1', memberName: '赵萸艳', changeType: '新增', changeTypeVariant: 'primary', changeMenu: '项目管理', before: '-', after: '可访问', operator: '郑婷雅', changeTime: '2025-11-06 14:30' },
    { key: '2', memberName: '冯云', changeType: '移除', changeTypeVariant: 'danger', changeMenu: '薪酬管理', before: '可访问', after: '-', operator: '周琎', changeTime: '2025-11-06 13:25' },
    { key: '3', memberName: '郑婷雅', changeType: '修改', changeTypeVariant: 'warning', changeMenu: '智能人事', before: '只读', after: '可编辑', operator: '赵萸艳', changeTime: '2025-11-05 16:40' },
    { key: '4', memberName: '周琎', changeType: '移除', changeTypeVariant: 'danger', changeMenu: '文档库', before: '可访问', after: '-', operator: '冯云', changeTime: '2025-11-05 11:20' },
    { key: '5', memberName: '孙思达', changeType: '新增', changeTypeVariant: 'primary', changeMenu: 'T度导向', before: '-', after: '可访问', operator: '赵萸艳', changeTime: '2025-11-04 17:55' },
    { key: '6', memberName: '赵吾光', changeType: '修改', changeTypeVariant: 'warning', changeMenu: '招聘', before: '只读', after: '可编辑', operator: '郑婷雅', changeTime: '2025-11-04 10:15' },
  ]);
}
