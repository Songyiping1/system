import { Component, signal, computed } from '@angular/core';
import { PersonTreeComponent } from '../../shared/components/person-tree/person-tree.component';
import { TreeTableComponent } from '../../shared/components/tree-table/tree-table.component';
import { SearchInputComponent } from '../../shared/components/search-input/search-input.component';
import { ColumnDef, TreeNode, PersonTreeNode } from '../../shared/models';

@Component({
  selector: 'app-permission-query',
  imports: [PersonTreeComponent, TreeTableComponent, SearchInputComponent],
  templateUrl: './permission-query.html',
  styleUrl: './permission-query.scss',
})
export class PermissionQuery {
  readonly searchValue = signal('');
  readonly selectedPersonKeys = signal<string[]>(['zhao-yuyan']);
  readonly compareCount = signal(0);
  readonly compareMax = 2;

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
                    { key: 'zhao-yuyan', label: '张竞元', avatar: '' },
                    { key: 'zheng-tingya', label: '刘俊良', avatar: '' },
                    { key: 'feng-yun', label: '张三', avatar: '' },
                  ],
                },
                {
                  key: 'frontend-group2',
                  label: '前端开发二组',
                  childCount: 80,
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

  readonly permissionColumns = signal<ColumnDef[]>([
    { key: 'name', label: '名称', width: '240px' },
    { key: 'route', label: 'route 路由' },
    { key: 'source', label: '来源' },
    { key: 'description', label: '描述' },
  ]);

  readonly permissionExpandedKeys = signal<string[]>(['menu-1', 'menu-1-1']);

  readonly permissionData = signal<TreeNode[]>([
    {
      key: 'menu-0',
      data: { name: 'T度导向', route: '/doc', source: '角色：普通员工', description: '成员开月、周度导向会议及填写日导向...' },
    },
    {
      key: 'menu-1',
      data: { name: '项目管理', route: '/doc', source: '岗位：前端开发工程师（总监）', description: '成员开月、周度导向会议及填写日导向...' },
      children: [
        {
          key: 'menu-1-1',
          data: { name: 'T度导向', route: '/doc', source: '角色：普通员工', description: '成员开月、周度导向会议及填写日导向...' },
          children: [
            { key: 'menu-1-1-1', data: { name: 'T度导向', route: '/doc', source: '角色：普通员工', description: '成员开月、周度导向会议及填写日导向...' } },
            { key: 'menu-1-1-2', data: { name: 'T度导向', route: '/doc', source: '岗位：UI设计师（普通员工）', description: '成员开月、周度导向会议及填写日导向...' } },
            { key: 'menu-1-1-3', data: { name: 'T度导向', route: '/doc', source: '岗位：UI设计师（组长）', description: '成员开月、周度导向会议及填写日导向...' } },
          ],
        },
        { key: 'menu-1-2', data: { name: 'T度导向', route: '/doc', source: '角色：普通员工', description: '成员开月、周度导向会议及填写日导向...' } },
      ],
    },
    {
      key: 'menu-2',
      data: { name: 'T度导向', route: '/doc', source: '角色：普通员工', description: '成员开月、周度导向会议及填写日导向...' },
      children: [
        { key: 'menu-2-1', data: { name: 'T度导向', route: '/doc', source: '角色：普通员工', description: '成员开月、周度导向会议及填写日导向...' } },
      ],
    },
    {
      key: 'menu-3',
      data: { name: 'T度导向', route: '/doc', source: '角色：普通员工', description: '成员开月、周度导向会议及填写日导向...' },
      children: [
        { key: 'menu-3-1', data: { name: 'T度导向', route: '/doc', source: '岗位：UI设计师（主管）', description: '成员开月、周度导向会议及填写日导向...' } },
        { key: 'menu-3-2', data: { name: 'T度导向', route: '/doc', source: '岗位：UI设计师（主管）', description: '成员开月、周度导向会议及填写日导向...' } },
      ],
    },
  ]);

  onPersonSelectionChange(keys: string[]): void {
    this.selectedPersonKeys.set(keys);
  }

  onPermissionExpandedKeysChange(keys: string[]): void {
    this.permissionExpandedKeys.set(keys);
  }
}
