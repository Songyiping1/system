import { Component, signal } from '@angular/core';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { SearchInputComponent } from '../../shared/components/search-input/search-input.component';
import { FilterBarComponent } from '../../shared/components/filter-bar/filter-bar.component';
import { FilterItem } from '../../shared/models';

interface DescSegment {
  type: 'text' | 'person';
  value: string;
}

interface ChangeRow {
  key: string;
  targetName: string;
  operatorName: string;
  department: string;
  eventType: string;
  description: DescSegment[];
  createTime: string;
}

@Component({
  selector: 'app-member-permission-change',
  imports: [PageHeaderComponent, SearchInputComponent, FilterBarComponent],
  templateUrl: './member-permission-change.html',
  styleUrl: './member-permission-change.scss',
})
export class MemberPermissionChange {
  readonly searchValue = signal('');

  readonly filters = signal<FilterItem[]>([
    { key: 'department', label: '部门', value: '', type: 'select', options: [
      { label: '全部', value: '' },
      { label: '开发部', value: '开发部' },
      { label: '人力资源', value: '人力资源' },
      { label: '运营部', value: '运营部' },
      { label: '财务部', value: '财务部' },
    ]},
    { key: 'target', label: '权限变更对象', value: '', type: 'select', options: [
      { label: '全部', value: '' },
      { label: '李琳颖', value: '李琳颖' },
      { label: '李世海', value: '李世海' },
      { label: '郑婷雅', value: '郑婷雅' },
      { label: '周静', value: '周静' },
    ]},
    { key: 'operator', label: '操作人', value: '', type: 'input' },
    { key: 'time', label: '时间', value: '', type: 'date-range' },
  ]);

  readonly rows = signal<ChangeRow[]>([
    {
      key: '1', targetName: '李琳颖', operatorName: '王凡玄', department: '部门',
      eventType: '添加',
      description: [
        { type: 'person', value: '王凡玄' },
        { type: 'text', value: ' 向 ' },
        { type: 'person', value: '李琳颖' },
        { type: 'text', value: ' 添加了 T度导向' },
      ],
      createTime: '2025/10/10  13:25:30',
    },
    {
      key: '2', targetName: '李世海', operatorName: '王凡玄', department: '部门',
      eventType: '添加',
      description: [
        { type: 'person', value: '王凡玄' },
        { type: 'text', value: ' 向 ' },
        { type: 'person', value: '李世海' },
        { type: 'text', value: ' 添加了 项目管理的菜单权限' },
      ],
      createTime: '2025/10/10  13:25:30',
    },
    {
      key: '3', targetName: '郑婷雅', operatorName: '王凡玄', department: '部门',
      eventType: '移除',
      description: [
        { type: 'person', value: '王凡玄' },
        { type: 'text', value: ' 回收了 ' },
        { type: 'person', value: '郑婷雅' },
        { type: 'text', value: ' 的 智能人事的菜单权限' },
      ],
      createTime: '2025/10/10  13:25:30',
    },
    {
      key: '4', targetName: '周静', operatorName: '王凡玄', department: '部门',
      eventType: '移除',
      description: [
        { type: 'person', value: '王凡玄' },
        { type: 'text', value: ' 回收了 ' },
        { type: 'person', value: '周静' },
        { type: 'text', value: ' 的 任务管理的菜单权限' },
      ],
      createTime: '2025/10/10  13:25:30',
    },
    {
      key: '5', targetName: '赵萸艳', operatorName: '王凡玄', department: '部门',
      eventType: '添加',
      description: [
        { type: 'person', value: '王凡玄' },
        { type: 'text', value: ' 向 ' },
        { type: 'person', value: '赵萸艳' },
        { type: 'text', value: ' 添加了 薪酬管理的菜单权限' },
      ],
      createTime: '2025/10/10  13:25:30',
    },
    {
      key: '6', targetName: '冯艺莲', operatorName: '王凡玄', department: '部门',
      eventType: '添加',
      description: [
        { type: 'person', value: '王凡玄' },
        { type: 'text', value: ' 向 ' },
        { type: 'person', value: '冯艺莲' },
        { type: 'text', value: ' 添加了 文档库的菜单权限' },
      ],
      createTime: '2025/10/10  13:25:30',
    },
    {
      key: '7', targetName: '孙思达', operatorName: '王凡玄', department: '部门',
      eventType: '移除',
      description: [
        { type: 'person', value: '王凡玄' },
        { type: 'text', value: ' 回收了 ' },
        { type: 'person', value: '孙思达' },
        { type: 'text', value: ' 的 日程的菜单权限' },
      ],
      createTime: '2025/10/10  13:25:30',
    },
    {
      key: '8', targetName: '赵吾光', operatorName: '王凡玄', department: '部门',
      eventType: '添加',
      description: [
        { type: 'person', value: '王凡玄' },
        { type: 'text', value: ' 向 ' },
        { type: 'person', value: '赵吾光' },
        { type: 'text', value: ' 添加了 招聘的菜单权限' },
      ],
      createTime: '2025/10/10  13:25:30',
    },
  ]);

  onFilterChange(event: { key: string; value: string }): void {
    this.filters.update(filters =>
      filters.map(f => f.key === event.key ? { ...f, value: event.value } : f)
    );
  }

  getInitial(name: string): string {
    return name.charAt(0);
  }
}
