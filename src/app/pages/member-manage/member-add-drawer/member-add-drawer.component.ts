import { Component, input, output, signal, computed, inject, effect } from '@angular/core';
import { OrganizeMemberApiService, OrganizeApiService } from '../../../api';
import { AuthService } from '../../../services/auth.service';
import { type TreeNodeOrganize } from '../../../api/types';

export interface DeptDropdownOption {
  id: string;
  name: string;
  level: number;
  hasChildren: boolean;
  expanded: boolean;
  children: DeptDropdownOption[];
}

@Component({
  selector: 'app-member-add-drawer',
  standalone: true,
  templateUrl: './member-add-drawer.component.html',
  styleUrl: './member-add-drawer.component.scss',
})
export class MemberAddDrawerComponent {
  private memberApi = inject(OrganizeMemberApiService);
  private organizeApi = inject(OrganizeApiService);
  private auth = inject(AuthService);

  visible = input(false);
  deptId = input('');
  deptName = input('');
  editMode = input(false);
  editName = input('');
  editMobile = input('');
  editUserId = input('');
  closed = output<void>();
  saved = output<void>();

  userName = signal('');
  mobile = signal('');
  sex = signal<number | null>(null);

  /** 性别下拉 */
  sexDropdownOpen = signal(false);
  sexOptions = [
    { value: 1, label: '男' },
    { value: 2, label: '女' },
  ];
  sexLabel = computed(() => {
    const v = this.sex();
    if (v === null) return '请填写员工性别（非必填）';
    return this.sexOptions.find(o => o.value === v)?.label ?? '';
  });

  /** 部门下拉 */
  selectedDeptId = signal<string>('');
  selectedDeptName = signal('');
  deptDropdownOpen = signal(false);
  deptTree = signal<DeptDropdownOption[]>([]);

  /** 扁平化后的部门列表（用于渲染） */
  flatDepts = computed(() => {
    const result: DeptDropdownOption[] = [];
    const walk = (items: DeptDropdownOption[], level: number) => {
      for (const item of items) {
        result.push({ ...item, level });
        if (item.expanded && item.children.length) {
          walk(item.children, level + 1);
        }
      }
    };
    walk(this.deptTree(), 0);
    return result;
  });

  title = computed(() => this.editMode() ? '编辑人员信息' : '添加人员');
  canSave = computed(() => this.userName().trim().length > 0 && this.mobile().trim().length > 0 && this.selectedDeptId().length > 0);

  constructor() {
    effect(() => {
      if (this.visible()) {
        // 初始化部门选择为父组件传入的值
        this.selectedDeptId.set(this.deptId());
        this.selectedDeptName.set(this.deptName());
        this.loadDeptTree();
        if (this.editMode()) {
          this.userName.set(this.editName());
          this.mobile.set(this.editMobile());
        }
      }
    });
  }

  /** 加载部门树 */
  loadDeptTree() {
    const companyId = this.auth.currentUser()?.companyId ?? '';
    this.organizeApi.loadOrganize({ companyId }).subscribe({
      next: (res) => {
        this.deptTree.set(this.convertDeptTree(res));
      },
    });
  }

  /** 切换性别下拉 */
  toggleSexDropdown(event: MouseEvent) {
    event.stopPropagation();
    this.deptDropdownOpen.set(false);
    this.sexDropdownOpen.update(v => !v);
  }

  /** 选择性别 */
  selectSex(value: number) {
    this.sex.set(value);
    this.sexDropdownOpen.set(false);
  }

  /** 切换部门下拉 */
  toggleDeptDropdown(event: MouseEvent) {
    event.stopPropagation();
    this.sexDropdownOpen.set(false);
    this.deptDropdownOpen.update(v => !v);
  }

  /** 选择部门 */
  selectDept(item: DeptDropdownOption) {
    this.selectedDeptId.set(item.id);
    this.selectedDeptName.set(item.name);
    this.deptDropdownOpen.set(false);
  }

  /** 展开/收起子级 */
  toggleDeptExpand(event: MouseEvent, item: DeptDropdownOption) {
    event.stopPropagation();
    this.deptTree.update(tree => {
      this.toggleNodeExpand(tree, item.id);
      return [...tree];
    });
  }

  closeAllDropdowns() {
    this.sexDropdownOpen.set(false);
    this.deptDropdownOpen.set(false);
  }

  onClose() {
    this.reset();
    this.closed.emit();
  }

  onSave() {
    if (!this.canSave()) return;
    const companyId = this.auth.currentUser()?.companyId ?? '';

    if (this.editMode()) {
      this.memberApi.addMember({
        companyId,
        userId: this.editUserId(),
        userName: this.userName(),
        mobile: this.mobile(),
        sex: this.sex() ?? undefined,
        deptId: this.selectedDeptId(),
      }).subscribe({
        next: () => {
          this.saved.emit();
          this.onClose();
        },
      });
    } else {
      this.memberApi.addMember({
        companyId,
        userName: this.userName(),
        mobile: this.mobile(),
        sex: this.sex() ?? undefined,
        deptId: this.selectedDeptId(),
      }).subscribe({
        next: () => {
          this.saved.emit();
          this.onClose();
        },
      });
    }
  }

  private reset() {
    this.userName.set('');
    this.mobile.set('');
    this.sex.set(null);
    this.sexDropdownOpen.set(false);
    this.selectedDeptId.set('');
    this.selectedDeptName.set('');
    this.deptDropdownOpen.set(false);
  }

  private convertDeptTree(nodes: TreeNodeOrganize[]): DeptDropdownOption[] {
    return nodes.map(node => ({
      id: node.id ?? '',
      name: node.name ?? '',
      level: 0,
      hasChildren: (node.children?.length ?? 0) > 0,
      expanded: false,
      children: node.children?.length ? this.convertDeptTree(node.children) : [],
    }));
  }

  private toggleNodeExpand(nodes: DeptDropdownOption[], id: string): boolean {
    for (const node of nodes) {
      if (node.id === id) {
        node.expanded = !node.expanded;
        return true;
      }
      if (node.children.length && this.toggleNodeExpand(node.children, id)) {
        return true;
      }
    }
    return false;
  }
}
