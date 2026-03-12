import { Component, signal, computed } from '@angular/core';
import { SearchInputComponent } from '../../shared/components/search-input/search-input.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { DataTableComponent } from '../../shared/components/data-table/data-table.component';
import { AvatarComponent } from '../../shared/components/avatar/avatar.component';
import { CheckboxComponent } from '../../shared/components/checkbox/checkbox.component';
import { RoleListComponent } from '../../shared/components/role-list/role-list.component';
import { TreeTableComponent } from '../../shared/components/tree-table/tree-table.component';
import { RoleGroup, ColumnDef, TreeNode } from '../../shared/models';

interface RoleMemberRow {
  key: string;
  name: string;
  department: string;
  employeeId: string;
  joinTime: string;
}

@Component({
  selector: 'app-role-manage',
  imports: [SearchInputComponent, ButtonComponent, DataTableComponent, AvatarComponent, CheckboxComponent, RoleListComponent, TreeTableComponent],
  templateUrl: './role-manage.html',
  styleUrl: './role-manage.scss',
})
export class RoleManage {
  readonly searchValue = signal('');
  readonly memberSearchValue = signal('');
  readonly selectedRoleKeys = signal<string[]>(['super-admin']);
  readonly selectedMemberKeys = signal<string[]>([]);
  readonly activeTab = signal<'menu' | 'data' | 'members'>('menu');

  readonly roleGroups = signal<RoleGroup[]>([
    {
      title: '系统角色',
      expanded: true,
      roles: [
        { key: 'super-admin', label: '超级管理员', badge: '系统' },
        { key: 'admin', label: '管理员', badge: '系统' },
        { key: 'member', label: '普通成员', badge: '系统' },
      ],
    },
    {
      title: '自定义角色',
      expanded: true,
      roles: [
        { key: 'dept-manager', label: '部门主管' },
        { key: 'project-manager', label: '项目经理' },
        { key: 'finance-auditor', label: '财务审核' },
      ],
    },
  ]);

  readonly menuPermissionColumns = signal<ColumnDef[]>([
    { key: 'name', label: '菜单名称', width: '240px' },
    { key: 'type', label: '权限类型' },
    { key: 'status', label: '状态' },
  ]);

  readonly menuPermissionExpandedKeys = signal<string[]>(['mp-1', 'mp-2']);

  readonly menuPermissionData = signal<TreeNode[]>([
    {
      key: 'mp-1',
      data: { name: '工作台', type: '菜单权限', checked: true },
      children: [
        { key: 'mp-1-1', data: { name: '工作概览', type: '页面权限', checked: true } },
        { key: 'mp-1-2', data: { name: '待办事项', type: '页面权限', checked: true } },
        { key: 'mp-1-3', data: { name: '数据看板', type: '页面权限', checked: false } },
      ],
    },
    {
      key: 'mp-2',
      data: { name: '项目管理', type: '菜单权限', checked: true },
      children: [
        { key: 'mp-2-1', data: { name: '项目列表', type: '页面权限', checked: true } },
        { key: 'mp-2-2', data: { name: '项目统计', type: '页面权限', checked: false } },
        { key: 'mp-2-3', data: { name: '任务看板', type: '页面权限', checked: true } },
      ],
    },
    { key: 'mp-3', data: { name: '智能人事', type: '菜单权限', checked: true } },
    { key: 'mp-4', data: { name: '文档库', type: '菜单权限', checked: false } },
    { key: 'mp-5', data: { name: '日程', type: '菜单权限', checked: true } },
    { key: 'mp-6', data: { name: '审批中心', type: '菜单权限', checked: false } },
  ]);

  readonly memberColumns = signal<ColumnDef[]>([
    { key: 'name', label: '姓名' },
    { key: 'department', label: '部门' },
    { key: 'employeeId', label: '工号' },
    { key: 'joinTime', label: '加入时间' },
  ]);

  readonly roleMembers = signal<RoleMemberRow[]>([
    { key: '1', name: '郑婷雅', department: '设计部', employeeId: 'EMP001', joinTime: '2025-10-15' },
    { key: '2', name: '周静', department: '开发部', employeeId: 'EMP002', joinTime: '2025-10-16' },
    { key: '3', name: '钱雨萌', department: '开发部', employeeId: 'EMP003', joinTime: '2025-10-17' },
    { key: '4', name: '李婷', department: '产品部', employeeId: 'EMP004', joinTime: '2025-10-18' },
    { key: '5', name: '孙旖茹', department: '运营部', employeeId: 'EMP005', joinTime: '2025-10-20' },
    { key: '6', name: '赵萸艳', department: '开发部', employeeId: 'EMP006', joinTime: '2025-10-21' },
  ]);

  readonly selectedRole = computed(() => {
    const keys = this.selectedRoleKeys();
    if (keys.length === 0) return null;
    const roleKey = keys[0];
    for (const group of this.roleGroups()) {
      for (const role of group.roles) {
        if (role.key === roleKey) return role;
      }
    }
    return null;
  });

  readonly roleDescription = computed(() => {
    const role = this.selectedRole();
    if (!role) return '';
    const descriptions: Record<string, string> = {
      'super-admin': '拥有系统全部权限，不可删除和修改',
      'admin': '拥有大部分管理权限，可管理普通成员',
      'member': '拥有基本的系统使用权限',
      'dept-manager': '管理本部门的成员和业务',
      'project-manager': '管理项目进度和项目成员',
      'finance-auditor': '审核财务相关流程和数据',
    };
    return descriptions[role.key] || '';
  });

  readonly allMemberKeys = computed(() => this.roleMembers().map(m => m.key));

  readonly selectAllMembers = computed(() => {
    const keys = this.selectedMemberKeys();
    const all = this.allMemberKeys();
    return all.length > 0 && keys.length === all.length;
  });

  onRoleSelectionChange(keys: string[]): void {
    this.selectedRoleKeys.set(keys);
    this.selectedMemberKeys.set([]);
    this.activeTab.set('menu');
  }

  setActiveTab(tab: 'menu' | 'data' | 'members'): void {
    this.activeTab.set(tab);
  }

  onMenuPermissionExpandedKeysChange(keys: string[]): void {
    this.menuPermissionExpandedKeys.set(keys);
  }

  toggleSelectAllMembers(): void {
    if (this.selectAllMembers()) {
      this.selectedMemberKeys.set([]);
    } else {
      this.selectedMemberKeys.set(this.allMemberKeys());
    }
  }

  toggleMemberRow(key: string): void {
    const keys = this.selectedMemberKeys();
    if (keys.includes(key)) {
      this.selectedMemberKeys.set(keys.filter(k => k !== key));
    } else {
      this.selectedMemberKeys.set([...keys, key]);
    }
  }

  isMemberSelected(key: string): boolean {
    return this.selectedMemberKeys().includes(key);
  }
}
