import { Component, signal, computed } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { SearchInputComponent } from '../../shared/components/search-input/search-input.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { FilterBarComponent } from '../../shared/components/filter-bar/filter-bar.component';
import { AvatarComponent } from '../../shared/components/avatar/avatar.component';
import { CheckboxComponent } from '../../shared/components/checkbox/checkbox.component';
import { CompanyIconComponent } from '../../shared/components/company-icon/company-icon.component';
import { TypeBadgeComponent } from '../../shared/components/type-badge/type-badge.component';
import { FilterItem } from '../../shared/models';

interface DeptNode {
  key: string;
  name: string;
  count: number;
  children?: DeptNode[];
}

interface ContextMenuItem {
  label: string;
  danger?: boolean;
}

interface MemberRow {
  key: string;
  name: string;
  status: '正常' | '离职' | '未加入';
  department: string;
  position: string;
}

@Component({
  selector: 'app-member-manage',
  imports: [NgTemplateOutlet, SearchInputComponent, ButtonComponent, FilterBarComponent, AvatarComponent, CheckboxComponent, CompanyIconComponent, TypeBadgeComponent],
  templateUrl: './member-manage.html',
  styleUrl: './member-manage.scss',
})
export class MemberManage {
  readonly searchValue = signal('');
  readonly selectedDeptKey = signal('fe-group-1');
  readonly expandedKeys = signal<string[]>(['dev', 'fe']);
  readonly contextMenuKey = signal<string | null>('fe-group-1');
  readonly selectedMemberKeys = signal<string[]>([]);

  readonly deptTree = signal<DeptNode[]>([
    {
      key: 'dev', name: '开发部', count: 2, children: [
        {
          key: 'fe', name: '前端开发', count: 2, children: [
            { key: 'fe-group-1', name: '前端开发一组', count: 30 },
          ]
        },
        { key: 'be', name: '后端开发', count: 0 },
      ]
    },
    { key: 'product', name: '产品部', count: 8 },
    { key: 'ops', name: '运营部', count: 80 },
    { key: 'defense', name: '国防部', count: 80 },
    { key: 'police', name: '公安部', count: 80 },
  ]);

  readonly filters = signal<FilterItem[]>([
    { key: 'status', label: '人员状态', value: '全部', type: 'select', options: [
      { value: '全部', label: '全部' }, { value: '正常', label: '正常' }, { value: '离职', label: '离职' }, { value: '未加入', label: '未加入' },
    ]},
    { key: 'showPerson', label: '显示人员', value: '显示全部人员', type: 'select', options: [
      { value: '显示全部人员', label: '显示全部人员' }, { value: '仅显示直属人员', label: '仅显示直属人员' },
    ]},
    { key: 'resigned', label: '90天内离职人员', value: '不显示', type: 'select', options: [
      { value: '不显示', label: '不显示' }, { value: '显示', label: '显示' },
    ]},
  ]);

  readonly members = signal<MemberRow[]>([
    { key: '1', name: '郑婷雅', status: '正常', department: '前端开发一组', position: '前端开发' },
    { key: '2', name: '周静', status: '离职', department: '一组2部', position: '前端开发' },
    { key: '3', name: '钱雨萌', status: '正常', department: '前端开发一组', position: '前端开发' },
    { key: '4', name: '李婷', status: '未加入', department: '前端开发一组', position: '前端开发' },
    { key: '5', name: '孙旖茹', status: '未加入', department: '前端开发一组', position: '前端开发' },
    { key: '6', name: '赵萸艳', status: '正常', department: '一组2部', position: '前端开发' },
    { key: '7', name: '王晓芳', status: '正常', department: '前端开发一组', position: '前端开发' },
    { key: '8', name: '张明远', status: '正常', department: '前端开发一组', position: '前端开发' },
  ]);

  readonly selectedDept = computed(() => {
    const key = this.selectedDeptKey();
    const find = (nodes: DeptNode[]): DeptNode | null => {
      for (const n of nodes) {
        if (n.key === key) return n;
        if (n.children) {
          const found = find(n.children);
          if (found) return found;
        }
      }
      return null;
    };
    return find(this.deptTree());
  });

  readonly allMemberKeys = computed(() => this.members().map(m => m.key));

  readonly selectAllMembers = computed(() => {
    const keys = this.selectedMemberKeys();
    const all = this.allMemberKeys();
    return all.length > 0 && keys.length === all.length;
  });

  readonly indeterminate = computed(() => {
    const keys = this.selectedMemberKeys();
    const all = this.allMemberKeys();
    return keys.length > 0 && keys.length < all.length;
  });

  getContextMenuItems(node: DeptNode): ContextMenuItem[] {
    if (node.key === 'fe-group-1') {
      return [
        { label: '编辑部门信息' },
        { label: '设置部门主管' },
        { label: '添加子部门' },
      ];
    }
    if (node.key === 'product') {
      return [
        { label: '编辑部门信息' },
        { label: '添加子部门' },
        { label: '删除部门', danger: true },
      ];
    }
    return [
      { label: '编辑部门信息' },
      { label: '添加子部门' },
    ];
  }

  isExpanded(key: string): boolean {
    return this.expandedKeys().includes(key);
  }

  toggleExpand(key: string, event: Event): void {
    event.stopPropagation();
    const keys = this.expandedKeys();
    if (keys.includes(key)) {
      this.expandedKeys.set(keys.filter(k => k !== key));
    } else {
      this.expandedKeys.set([...keys, key]);
    }
  }

  selectDept(key: string): void {
    this.selectedDeptKey.set(key);
    this.contextMenuKey.set(key);
  }

  toggleContextMenu(key: string, event: Event): void {
    event.stopPropagation();
    if (this.contextMenuKey() === key) {
      this.contextMenuKey.set(null);
    } else {
      this.contextMenuKey.set(key);
    }
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

  onFilterChange(event: { key: string; value: string }): void {
    const filters = this.filters().map(f =>
      f.key === event.key ? { ...f, value: event.value } : f
    );
    this.filters.set(filters);
  }

  getStatusVariant(status: string): 'success' | 'danger' | 'warning' | 'default' {
    switch (status) {
      case '正常': return 'success';
      case '离职': return 'danger';
      case '未加入': return 'warning';
      default: return 'default';
    }
  }
}
