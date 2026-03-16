import { Component, signal } from '@angular/core';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { SearchInputComponent } from '../../shared/components/search-input/search-input.component';
import { FilterBarComponent } from '../../shared/components/filter-bar/filter-bar.component';
import { DataTableComponent } from '../../shared/components/data-table/data-table.component';
import { ColumnDef, FilterItem } from '../../shared/models';

interface AdminRow {
  key: string;
  name: string;
  avatar: string;
  badge?: string;
  department: string;
  employeeId: string;
  scopes: string[];
  adderName: string;
  adderAvatar: string;
  operationTime: string;
}

@Component({
  selector: 'app-member-admin-permission',
  imports: [PageHeaderComponent, SearchInputComponent, FilterBarComponent, DataTableComponent],
  templateUrl: './member-admin-permission.html',
  styleUrl: './member-admin-permission.scss',
})
export class MemberAdminPermission {
  readonly searchValue = signal('');

  readonly filters = signal<FilterItem[]>([
    { key: 'department', label: '部门', value: '开发部', type: 'select', options: [
      { label: '全部', value: '' },
      { label: '开发部', value: '开发部' },
      { label: '人力资源', value: '人力资源' },
      { label: '运营部', value: '运营部' },
      { label: '财务部', value: '财务部' },
      { label: '管理部', value: '管理部' },
    ]},
    { key: 'scope', label: '管理范围', value: '', type: 'select', options: [
      { label: '全部', value: '' },
      { label: 'T度导向', value: 'T度导向' },
      { label: '审批', value: '审批' },
      { label: '商学院', value: '商学院' },
      { label: '文档库', value: '文档库' },
      { label: '日程', value: '日程' },
    ]},
    { key: 'permission', label: '权限点', value: '', type: 'select', options: [
      { label: '全部', value: '' },
      { label: '超级管理员', value: '超级管理员' },
      { label: '系统管理员', value: '系统管理员' },
    ]},
  ]);

  readonly columns = signal<ColumnDef[]>([
    { key: 'name', label: '管理员', width: '208px' },
    { key: 'department', label: '部门', width: '161px' },
    { key: 'employeeId', label: '工号', width: '160px' },
    { key: 'scope', label: '管理范围' },
    { key: 'adder', label: '添加者', width: '289px' },
    { key: 'time', label: '操作时间', width: '253px' },
  ]);

  readonly rows = signal<AdminRow[]>([
    { key: '1', name: '系统管理员', avatar: '', badge: '超级管理员', department: '开发部', employeeId: '154rt4ddf', scopes: ['T度导向'], adderName: '系统管理员', adderAvatar: '', operationTime: '2025/10/10  13:25:30' },
    { key: '2', name: '赵吾光', avatar: '', department: '人力资源', employeeId: '154rt4ddf', scopes: ['审批'], adderName: '系统管理员', adderAvatar: '', operationTime: '2025/10/10  13:25:30' },
    { key: '3', name: '郑盈', avatar: '', department: '运营部', employeeId: '154rt4ddf', scopes: ['商学院'], adderName: '系统管理员', adderAvatar: '', operationTime: '2025/10/10  13:25:30' },
    { key: '4', name: '郑婷雅', avatar: '', department: '人力资源', employeeId: '154rt4ddf', scopes: ['文档库'], adderName: '系统管理员', adderAvatar: '', operationTime: '2025/10/10  13:25:30' },
    { key: '5', name: '孙思达', avatar: '', department: '人力资源', employeeId: '154rt4ddf', scopes: ['日程'], adderName: '系统管理员', adderAvatar: '', operationTime: '2025/10/10  13:25:30' },
    { key: '6', name: '赵萸艳', avatar: '', department: '财务部', employeeId: '154rt4ddf', scopes: ['薪酬管理'], adderName: '系统管理员', adderAvatar: '', operationTime: '2025/10/10  13:25:30' },
    { key: '7', name: '周静', avatar: '', department: '管理部', employeeId: '154rt4ddf', scopes: ['T度导向', '项目管理'], adderName: '系统管理员', adderAvatar: '', operationTime: '2025/10/10  13:25:30' },
    { key: '8', name: '冯艺莲', avatar: '', department: '人力资源部', employeeId: '154rt4ddf', scopes: ['智能人事', '后台管理：组织架构'], adderName: '系统管理员', adderAvatar: '', operationTime: '2025/10/10  13:25:30' },
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
