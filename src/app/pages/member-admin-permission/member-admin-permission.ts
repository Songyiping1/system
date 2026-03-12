import { Component, signal, computed } from '@angular/core';
import { SearchInputComponent } from '../../shared/components/search-input/search-input.component';
import { PersonTreeComponent } from '../../shared/components/person-tree/person-tree.component';
import { PersonTreeNode } from '../../shared/models';

interface PermissionItem {
  key: string;
  name: string;
  description: string;
  enabled: boolean;
}

interface PermissionCategory {
  title: string;
  items: PermissionItem[];
}

@Component({
  selector: 'app-member-admin-permission',
  imports: [SearchInputComponent, PersonTreeComponent],
  templateUrl: './member-admin-permission.html',
  styleUrl: './member-admin-permission.scss',
})
export class MemberAdminPermission {
  readonly searchValue = signal('');
  readonly selectedPersonKeys = signal<string[]>(['zhao-yuyan']);

  readonly personNodes = signal<PersonTreeNode[]>([
    {
      key: 'company',
      label: '中企云链（北京）信息科技有限公司',
      icon: 'company',
      iconColor: '#2e67f4',
      iconText: '中',
      children: [
        {
          key: 'dev-dept',
          label: '开发部',
          childCount: 2,
          children: [
            {
              key: 'frontend',
              label: '前端开发',
              childCount: 2,
              children: [
                {
                  key: 'frontend-group1',
                  label: '前端开发一组',
                  childCount: 30,
                  children: [
                    { key: 'zhao-yuyan', label: '赵萸艳', avatar: '' },
                    { key: 'zheng-tingya', label: '郑婷雅', avatar: '' },
                    { key: 'feng-yun', label: '冯云', avatar: '' },
                    { key: 'zhou-jin', label: '周琎', avatar: '' },
                  ],
                },
              ],
            },
          ],
        },
        { key: 'backend', label: '后端开发', childCount: 2 },
        { key: 'product-dept', label: '产品部', childCount: 80 },
        { key: 'ops-dept', label: '运营部', childCount: 80 },
        { key: 'defense-dept', label: '国防部', childCount: 80 },
        { key: 'police-dept', label: '公安部', childCount: 80 },
      ],
    },
  ]);

  readonly selectedPersonLabel = computed(() => {
    const keys = this.selectedPersonKeys();
    if (keys.length === 0) return '未选择';
    const findLabel = (nodes: PersonTreeNode[]): string => {
      for (const node of nodes) {
        if (keys.includes(node.key)) return node.label;
        if (node.children) {
          const found = findLabel(node.children);
          if (found) return found;
        }
      }
      return '';
    };
    return findLabel(this.personNodes()) || '未选择';
  });

  readonly permissionCategories = signal<PermissionCategory[]>([
    {
      title: '组织管理',
      items: [
        { key: 'org-create', name: '创建部门', description: '允许创建新的组织部门', enabled: true },
        { key: 'org-edit', name: '编辑部门', description: '允许编辑组织部门信息', enabled: true },
        { key: 'org-delete', name: '删除部门', description: '允许删除组织部门', enabled: false },
      ],
    },
    {
      title: '成员管理',
      items: [
        { key: 'member-invite', name: '邀请成员', description: '允许邀请新成员加入组织', enabled: true },
        { key: 'member-remove', name: '移除成员', description: '允许将成员从组织中移除', enabled: false },
        { key: 'member-edit', name: '编辑成员信息', description: '允许编辑成员的基本信息', enabled: true },
      ],
    },
    {
      title: '角色管理',
      items: [
        { key: 'role-create', name: '创建角色', description: '允许创建新的角色', enabled: false },
        { key: 'role-assign', name: '分配角色', description: '允许为成员分配角色', enabled: true },
        { key: 'role-delete', name: '删除角色', description: '允许删除自定义角色', enabled: false },
      ],
    },
    {
      title: '权限管理',
      items: [
        { key: 'perm-menu', name: '菜单权限配置', description: '允许配置菜单访问权限', enabled: true },
        { key: 'perm-data', name: '数据权限配置', description: '允许配置数据访问权限', enabled: false },
        { key: 'perm-audit', name: '权限审计', description: '允许查看权限变更记录', enabled: true },
      ],
    },
  ]);

  onPersonSelectionChange(keys: string[]): void {
    this.selectedPersonKeys.set(keys);
  }

  togglePermission(categoryIndex: number, itemIndex: number): void {
    const categories = this.permissionCategories().map((cat, ci) => {
      if (ci === categoryIndex) {
        return {
          ...cat,
          items: cat.items.map((item, ii) => {
            if (ii === itemIndex) {
              return { ...item, enabled: !item.enabled };
            }
            return item;
          }),
        };
      }
      return cat;
    });
    this.permissionCategories.set(categories);
  }
}
