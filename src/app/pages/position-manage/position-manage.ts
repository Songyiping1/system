import { Component, signal, computed } from '@angular/core';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { SearchInputComponent } from '../../shared/components/search-input/search-input.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { AvatarComponent } from '../../shared/components/avatar/avatar.component';

interface PositionRole {
  key: string;
  label: string;
}

interface PositionNode {
  key: string;
  label: string;
  tag?: string;
  roles?: PositionRole[];
  expanded?: boolean;
}

interface PositionMember {
  key: string;
  name: string;
  employeeId: string;
  email: string;
  phone: string;
}

@Component({
  selector: 'app-position-manage',
  imports: [PageHeaderComponent, SearchInputComponent, ButtonComponent, AvatarComponent],
  templateUrl: './position-manage.html',
  styleUrl: './position-manage.scss',
})
export class PositionManage {
  readonly searchValue = signal('');
  readonly memberSearchValue = signal('');
  readonly filterValue = signal('');
  readonly selectedPositionKey = signal('ue-designer');
  readonly selectedRoleKey = signal('normal');

  readonly companyName = signal('中企云链（北京）信息科技有限...');

  readonly positions = signal<PositionNode[]>([
    {
      key: 'ue-designer',
      label: 'UE设计师',
      tag: '产品部',
      expanded: true,
      roles: [
        { key: 'normal', label: '普通员工' },
        { key: 'director', label: '总监' },
      ],
    },
    {
      key: 'hr-specialist',
      label: '人事专员',
      expanded: true,
      roles: [
        { key: 'fe-engineer', label: '前端开发工程' },
      ],
    },
    { key: 'be-engineer', label: '后端开发工程师' },
    { key: 'mobile-engineer', label: '移动端前开发工程师', tag: '两端开发前后端' },
    { key: 'ops-specialist', label: '运营专员' },
    { key: 'product-director', label: '产品总监' },
    { key: 'gm-assistant', label: '总经理助理' },
  ]);

  readonly members = signal<PositionMember[]>([
    { key: '1', name: '郑婷雅', employeeId: '545596841', email: 'qrfl239@163.com', phone: '151 0853 5283' },
    { key: '2', name: '周静', employeeId: '545596841', email: 'xuanxuan.wu@gmail.com', phone: '152 4377 8630' },
    { key: '3', name: '钱雨萌', employeeId: '545596841', email: 'lsp007@gmail.com', phone: '181 0834 1643' },
    { key: '4', name: '李婷', employeeId: '545596841', email: 'sichai_feng@gmail.com', phone: '137 8651 5262' },
    { key: '5', name: '孙旖茹', employeeId: '545596841', email: '453741888@qq.com', phone: '131 1251 9348' },
    { key: '6', name: '赵萸艳', employeeId: '545596841', email: 'zhoujin@outlook.com', phone: '184 5857 8572' },
    { key: '7', name: '郑盈', employeeId: '545596841', email: '4534417778@qq.com', phone: '150 2212 3314' },
    { key: '8', name: '李豫卓', employeeId: '545596841', email: 'yq_wu@gmail.com', phone: '158 5666 9874' },
    { key: '9', name: '李琳颖', employeeId: '545596841', email: 'zhoujing@126.com', phone: '155 5866 1691' },
    { key: '10', name: '周小艺', employeeId: '545596841', email: 'fengy@163.com', phone: '136 3348 4128' },
    { key: '11', name: '冯云', employeeId: '545596841', email: 'ping_li@gmail.com', phone: '157 3143 5825' },
    { key: '12', name: '赵玉凤', employeeId: '545596841', email: 'yc_wu@gmail.com', phone: '187 3471 7201' },
  ]);

  readonly selectedPositionLabel = computed(() => {
    const posKey = this.selectedPositionKey();
    const roleKey = this.selectedRoleKey();
    const pos = this.positions().find(p => p.key === posKey);
    if (!pos) return '';
    const role = pos.roles?.find(r => r.key === roleKey);
    return role ? `${pos.label}_${role.label}` : pos.label;
  });

  readonly totalCount = computed(() => this.members().length);

  togglePosition(pos: PositionNode): void {
    if (!pos.roles?.length) return;
    this.positions.update(list =>
      list.map(p => p.key === pos.key ? { ...p, expanded: !p.expanded } : p)
    );
  }

  selectPosition(posKey: string, roleKey?: string): void {
    this.selectedPositionKey.set(posKey);
    this.selectedRoleKey.set(roleKey || '');
  }

  isPositionSelected(posKey: string, roleKey?: string): boolean {
    return this.selectedPositionKey() === posKey && this.selectedRoleKey() === (roleKey || '');
  }
}
