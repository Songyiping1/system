import { Component, signal, computed } from '@angular/core';
import { SearchInputComponent } from '../../shared/components/search-input/search-input.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { AvatarComponent } from '../../shared/components/avatar/avatar.component';
import { CheckboxComponent } from '../../shared/components/checkbox/checkbox.component';
import { RoleListComponent } from '../../shared/components/role-list/role-list.component';
import { RoleGroup } from '../../shared/models';

interface RoleMemberRow {
  key: string;
  name: string;
  department: string;
  employeeId: string;
  manageScope: string;
}

@Component({
  selector: 'app-role-manage',
  imports: [SearchInputComponent, ButtonComponent, PageHeaderComponent, AvatarComponent, CheckboxComponent, RoleListComponent],
  templateUrl: './role-manage.html',
  styleUrl: './role-manage.scss',
})
export class RoleManage {
  readonly searchValue = signal('');
  readonly selectedRoleKeys = signal<string[]>(['dept-manager']);
  readonly selectedMemberKeys = signal<string[]>([]);

  readonly roleGroups = signal<RoleGroup[]>([
    {
      title: '默认角色',
      expanded: true,
      roles: [
        { key: 'dept-manager', label: '部门主管' },
      ],
    },
    {
      title: '自定义分组名称（非定义分组）',
      expanded: true,
      roles: [
        { key: 'finance', label: '财务' },
        { key: 'purchase', label: '采购' },
        { key: 'it', label: 'IT' },
        { key: 'admin-office', label: '行政' },
        { key: 'operation', label: '运营' },
        { key: 'service', label: '管理' },
      ],
    },
    {
      title: '自定义分组名称（非定义分组）',
      expanded: true,
      roles: [
        { key: 'supervisor', label: '主管' },
        { key: 'senior-manager', label: '高级管理者' },
        { key: 'section-chief', label: '科长' },
        { key: 'general-manager', label: '总经理' },
      ],
    },
  ]);

  readonly roleMembers = signal<RoleMemberRow[]>([
    { key: '1', name: '郑婷雅', department: '设计部', employeeId: '545596841', manageScope: '全部' },
    { key: '2', name: '周静', department: '开发部', employeeId: '545596841', manageScope: '网络部' },
    { key: '3', name: '钱雨萌', department: '开发部', employeeId: '545596841', manageScope: '市场部' },
    { key: '4', name: '李婷', department: '开发部', employeeId: '545596841', manageScope: '生产部' },
    { key: '5', name: '孙旖茹', department: '开发部', employeeId: '545596841', manageScope: '管理部' },
    { key: '6', name: '赵萸艳', department: '开发部', employeeId: '545596841', manageScope: '财务部' },
    { key: '7', name: '郑盈', department: '开发部', employeeId: '545596841', manageScope: '品质管理部' },
    { key: '8', name: '李豫卓', department: '开发部', employeeId: '545596841', manageScope: '安全部' },
    { key: '9', name: '李琳颖', department: '开发部', employeeId: '545596841', manageScope: '客服部' },
    { key: '10', name: '周小艺', department: '开发部', employeeId: '545596841', manageScope: '销售部' },
    { key: '11', name: '冯云', department: '开发部', employeeId: '545596841', manageScope: '人力资源部' },
    { key: '12', name: '赵玉凤', department: '开发部', employeeId: '545596841', manageScope: '研发部' },
    { key: '13', name: '钱若霖', department: '开发部', employeeId: '545596841', manageScope: '采购部' },
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

  readonly isDefaultRole = computed(() => {
    const keys = this.selectedRoleKeys();
    if (keys.length === 0) return false;
    const defaultGroup = this.roleGroups()[0];
    return defaultGroup.roles.some(r => r.key === keys[0]);
  });

  readonly totalCount = computed(() => this.roleMembers().length);

  readonly allMemberKeys = computed(() => this.roleMembers().map(m => m.key));

  readonly selectAllMembers = computed(() => {
    const keys = this.selectedMemberKeys();
    const all = this.allMemberKeys();
    return all.length > 0 && keys.length === all.length;
  });

  readonly indeterminateMembers = computed(() => {
    const keys = this.selectedMemberKeys();
    const all = this.allMemberKeys();
    return keys.length > 0 && keys.length < all.length;
  });

  onRoleSelectionChange(keys: string[]): void {
    this.selectedRoleKeys.set(keys);
    this.selectedMemberKeys.set([]);
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
