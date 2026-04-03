import { Component, inject, signal, computed, OnInit, HostListener } from '@angular/core';
import { PageHeaderComponent, SearchInputComponent, SplitLayoutComponent, TreeListComponent, ModalComponent, type TreeNode } from '../../shared/components';
import { type PageState } from '../../shared/models/page-state';
import { RoleApiService } from '../../api';
import { type RoleVo } from '../../api/types';
import { AuthService } from '../../services/auth.service';

interface RoleRow {
  id: string;
  name: string;
  avatar: string;
  dept: string;
  jobNo: string;
  scope: string;
}

@Component({
  selector: 'app-role-manage',
  standalone: true,
  imports: [PageHeaderComponent, SearchInputComponent, SplitLayoutComponent, TreeListComponent, ModalComponent],
  templateUrl: './role-manage.component.html',
  styleUrl: './role-manage.component.scss',
})
export class RoleManageComponent implements OnInit {
  private roleApi = inject(RoleApiService);
  private auth = inject(AuthService);

  pageState = signal<PageState>('loading');
  searchKeyword = signal('');

  treeItems = signal<TreeNode[]>([]);
  activeTreeId = signal('');
  activeRoleName = signal('');
  activeRoleDesc = signal('');

  members = signal<RoleRow[]>([]);

  // 多选
  selectedIds = signal<Set<string>>(new Set());
  allSelected = computed(() => {
    const rows = this.members();
    const ids = this.selectedIds();
    return rows.length > 0 && rows.every(r => ids.has(r.id));
  });

  // 右键菜单
  contextMenuPos = signal<{ x: number; y: number } | null>(null);
  contextMenuNode = signal<TreeNode | null>(null);

  // 新建角色弹窗
  showRoleModal = signal(false);
  roleModalMode = signal<'create' | 'edit'>('create');
  roleFormName = signal('');
  editingRoleId = signal<string | null>(null);

  // 删除确认弹窗
  showDeleteModal = signal(false);

  isLoading = computed(() => this.pageState() === 'loading');
  totalCount = computed(() => this.members().length);
  roleModalTitle = computed(() => this.roleModalMode() === 'create' ? '新建角色' : '编辑角色');

  ngOnInit() {
    this.loadRoleTree();
  }

  loadRoleTree() {
    this.pageState.set('loading');
    const companyId = this.auth.currentUser()?.companyId ?? '';
    this.roleApi.listRole({ companyId }).subscribe({
      next: (res) => {
        const items = this.convertRoleTree(res);
        this.treeItems.set(items);
        const firstLeaf = this.findFirstLeaf(items);
        if (firstLeaf) {
          this.activeTreeId.set(firstLeaf.id);
          this.activeRoleName.set(firstLeaf.label);
          this.loadRoleUsers(firstLeaf.id);
        }
        this.pageState.set(items.length > 0 ? 'normal' : 'empty');
      },
      error: () => this.pageState.set('error'),
    });
  }

  loadRoleUsers(roleId: string) {
    const companyId = this.auth.currentUser()?.companyId ?? '';
    this.roleApi.listRoleUser({ roleId, companyId }).subscribe({
      next: (res: any[]) => {
        this.members.set(res.map(u => ({
          id: u.userId ?? '',
          name: u.name ?? '',
          avatar: (u.name ?? '').charAt(0),
          dept: u.deptName ?? '',
          jobNo: u.jobNo ?? '',
          scope: u.scope ?? '',
        })));
        this.selectedIds.set(new Set());
      },
    });
  }

  onSearch(keyword: string) {
    this.searchKeyword.set(keyword);
  }

  onTreeSelect(node: TreeNode) {
    this.activeTreeId.set(node.id);
    this.activeRoleName.set(node.label);
    this.loadRoleUsers(node.id);
  }

  // === 多选 ===
  toggleSelect(id: string) {
    this.selectedIds.update(s => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  toggleSelectAll() {
    if (this.allSelected()) {
      this.selectedIds.set(new Set());
    } else {
      this.selectedIds.set(new Set(this.members().map(r => r.id)));
    }
  }

  isSelected(id: string): boolean {
    return this.selectedIds().has(id);
  }

  // === 右键菜单 ===
  onTreeContextMenu(event: { node: TreeNode; event: MouseEvent }) {
    this.contextMenuNode.set(event.node);
    this.contextMenuPos.set({ x: event.event.clientX, y: event.event.clientY });
  }

  closeContextMenu() {
    this.contextMenuPos.set(null);
    this.contextMenuNode.set(null);
  }

  @HostListener('document:click')
  onDocumentClick() {
    if (this.contextMenuPos()) {
      this.closeContextMenu();
    }
  }

  // === 角色 CRUD ===
  onAddRole() {
    this.roleModalMode.set('create');
    this.roleFormName.set('');
    this.editingRoleId.set(null);
    this.showRoleModal.set(true);
  }

  onEditRole() {
    const node = this.contextMenuNode();
    if (!node) return;
    this.closeContextMenu();
    this.roleModalMode.set('edit');
    this.roleFormName.set(node.label);
    this.editingRoleId.set(node.id);
    this.showRoleModal.set(true);
  }

  onDeleteRole() {
    this.closeContextMenu();
    this.showDeleteModal.set(true);
  }

  onDeleteConfirmed() {
    const node = this.contextMenuNode();
    if (!node) return;
    this.showDeleteModal.set(false);
    const companyId = this.auth.currentUser()?.companyId ?? '';
    this.roleApi.removeRole({ id: node.id, companyId }).subscribe({
      next: () => this.loadRoleTree(),
    });
  }

  onRoleModalConfirm() {
    const name = this.roleFormName().trim();
    if (!name) return;
    const companyId = this.auth.currentUser()?.companyId ?? '';

    if (this.roleModalMode() === 'edit') {
      this.roleApi.updateRole({ id: this.editingRoleId()!, name, companyId }).subscribe({
        next: () => {
          this.showRoleModal.set(false);
          this.loadRoleTree();
        },
      });
    } else {
      this.roleApi.createRole({ name, companyId }).subscribe({
        next: () => {
          this.showRoleModal.set(false);
          this.loadRoleTree();
        },
      });
    }
  }

  private convertRoleTree(roles: RoleVo[]): TreeNode[] {
    return roles.map(r => ({
      id: r.id ?? '',
      label: r.name ?? '',
      expanded: true,
      children: r.children?.length ? this.convertRoleTree(r.children) : undefined,
    }));
  }

  private findFirstLeaf(items: TreeNode[]): TreeNode | null {
    for (const item of items) {
      if (!item.children?.length) return item;
      const found = this.findFirstLeaf(item.children);
      if (found) return found;
    }
    return null;
  }
}
