import { Component, inject, signal, computed, OnInit, HostListener } from '@angular/core';
import { PageHeaderComponent, SearchInputComponent, SplitLayoutComponent, TreeListComponent, ActionBarComponent, ButtonComponent, FilterSelectComponent, ModalComponent, type TreeNode } from '../../shared/components';
import { MemberAddDrawerComponent } from './member-add-drawer/member-add-drawer.component';
import { MemberImportModalComponent } from './member-import-modal/member-import-modal.component';
import { type PageState } from '../../shared/models/page-state';
import { OrganizeApiService, OrganizeMemberApiService } from '../../api';
import { type TreeNodeOrganize, type OrganizeUserVo } from '../../api/types/organize.type';
import { AuthService } from '../../services/auth.service';

interface MemberRow {
  id: string;
  name: string;
  avatar: string;
  status: string;
  dept: string;
  deptId: string;
  position: string;
  mobile: string;
  orgId: string;
}

@Component({
  selector: 'app-member-manage',
  standalone: true,
  imports: [PageHeaderComponent, SearchInputComponent, SplitLayoutComponent, TreeListComponent, ActionBarComponent, ButtonComponent, FilterSelectComponent, ModalComponent, MemberAddDrawerComponent, MemberImportModalComponent],
  templateUrl: './member-manage.component.html',
  styleUrl: './member-manage.component.scss',
})
export class MemberManageComponent implements OnInit {
  private organizeApi = inject(OrganizeApiService);
  private memberApi = inject(OrganizeMemberApiService);
  private auth = inject(AuthService);

  pageState = signal<PageState>('loading');
  searchKeyword = signal('');

  treeItems = signal<TreeNode[]>([]);
  activeTreeId = signal('');
  activeDeptName = signal('');

  members = signal<MemberRow[]>([]);

  // 多选
  selectedIds = signal<Set<string>>(new Set());
  allSelected = computed(() => {
    const rows = this.filteredMembers();
    const ids = this.selectedIds();
    return rows.length > 0 && rows.every(r => ids.has(r.id));
  });

  // 筛选
  statusFilter = signal('全部');
  showPersonFilter = signal('显示全部人员');
  showResigned = signal(false);

  // 排序
  sortColumn = signal<string | null>(null);
  sortDirection = signal<'asc' | 'desc'>('asc');

  // 右键菜单
  contextMenuPos = signal<{ x: number; y: number } | null>(null);
  contextMenuNode = signal<TreeNode | null>(null);

  // 部门弹窗
  showDeptModal = signal(false);
  deptModalMode = signal<'create' | 'edit'>('create');
  deptFormName = signal('');
  editingDeptId = signal<string | null>(null);
  parentDeptId = signal<string | null>(null);
  editingParentUri = signal<string | null>(null);

  // 删除确认弹窗
  showDeleteModal = signal(false);
  showChildDeptHint = signal(false);
  deletingNode = signal<TreeNode | null>(null);

  // 添加人员抽屉
  showAddMemberDrawer = signal(false);

  // 更多菜单
  showMoreMenu = signal(false);

  // 成员右键菜单
  memberMenuPos = signal<{ x: number; y: number } | null>(null);
  memberMenuRow = signal<MemberRow | null>(null);

  // 删除成员确认弹窗
  showDeleteMemberModal = signal(false);
  deleteMemberMode = signal<'single' | 'batch'>('single');
  deletingMember = signal<MemberRow | null>(null);

  // 变更部门弹窗
  showTransferModal = signal(false);
  transferMode = signal<'change' | 'transferAndDelete'>('change');
  transferTargetDeptId = signal('');
  transferringMember = signal<MemberRow | null>(null);

  // 导入导出弹窗
  showImportModal = signal(false);

  // 编辑列表弹窗
  showColumnEditor = signal(false);
  columnOptions = [
    { key: 'all', label: '展示全部人员', disabled: false },
    { key: 'name', label: '姓名', disabled: true },
    { key: 'status', label: '人员状态', disabled: false },
    { key: 'dept', label: '部门', disabled: false },
    { key: 'position', label: '岗位', disabled: false },
    { key: 'mobile', label: '登录手机号', disabled: false },
    { key: 'email', label: '登录邮箱', disabled: false },
    { key: 'jobNo', label: '工号', disabled: false },
    { key: 'sex', label: '性别', disabled: false },
    { key: 'workEmail', label: '工作邮箱', disabled: false },
    { key: 'region', label: '地区', disabled: false },
    { key: 'city', label: '城市', disabled: false },
    { key: 'leader', label: '直属上级', disabled: false },
    { key: 'memberType', label: '人员类型', disabled: false },
    { key: 'joinTime', label: '入职时间', disabled: false },
  ];
  visibleColumns = signal(new Set(['name', 'status', 'dept', 'position', 'mobile', 'email', 'jobNo', 'sex', 'workEmail', 'region', 'city', 'leader', 'memberType', 'joinTime']));

  // 计算属性
  isLoading = computed(() => this.pageState() === 'loading');

  filteredMembers = computed(() => {
    let rows = this.members();
    const keyword = this.searchKeyword().trim().toLowerCase();
    const status = this.statusFilter();

    if (keyword) {
      rows = rows.filter(r => r.name.toLowerCase().includes(keyword) || r.mobile.includes(keyword));
    }
    if (status !== '全部') {
      rows = rows.filter(r => r.status === status);
    }

    const col = this.sortColumn();
    if (col) {
      const dir = this.sortDirection() === 'asc' ? 1 : -1;
      rows = [...rows].sort((a, b) => {
        const va = (a as any)[col] ?? '';
        const vb = (b as any)[col] ?? '';
        return va.localeCompare(vb) * dir;
      });
    }
    return rows;
  });

  totalCount = computed(() => this.members().length);
  notJoinedCount = computed(() => this.members().filter(m => m.status === '未加入').length);

  deptModalTitle = computed(() => this.deptModalMode() === 'create' ? '新建部门' : '编辑部门');

  ngOnInit() {
    this.loadOrganizeTree();
  }

  loadOrganizeTree() {
    this.pageState.set('loading');
    const companyId = this.auth.currentUser()?.companyId ?? '';
    this.organizeApi.loadOrganize({ companyId }).subscribe({
      next: (res) => {
        const items = this.convertOrgTree(res);
        this.treeItems.set(items);
        if (items.length > 0) {
          const firstLeaf = this.findFirstLeaf(items);
          this.activeTreeId.set(firstLeaf.id);
          this.activeDeptName.set(firstLeaf.label);
          this.loadMembers(firstLeaf.id);
        }
        this.pageState.set(items.length > 0 ? 'normal' : 'empty');
      },
      error: () => this.pageState.set('error'),
    });
  }

  loadMembers(deptId: string) {
    const companyId = this.auth.currentUser()?.companyId ?? '';
    this.memberApi.listOrganizeMember({ companyId, deptId }).subscribe({
      next: (res) => {
        this.members.set(res.map(m => ({
          id: m.userId ?? '',
          name: m.name ?? m.userName ?? '',
          avatar: (m.name ?? m.userName ?? '').charAt(0),
          status: m.state === 1 ? '正常' : '未加入',
          dept: m.deptName ?? '',
          deptId: m.deptId ?? '',
          position: m.orgName ?? '',
          mobile: m.mobile ?? '',
          orgId: m.orgId ?? '',
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
    this.activeDeptName.set(node.label);
    this.loadMembers(node.id);
  }

  // === 筛选 ===
  onStatusFilterChange(value: string) {
    this.statusFilter.set(value);
  }

  onShowPersonFilterChange(value: string) {
    this.showPersonFilter.set(value);
  }

  // === 排序 ===
  onSort(column: string) {
    if (this.sortColumn() === column) {
      this.sortDirection.update(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortColumn.set(column);
      this.sortDirection.set('asc');
    }
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
      this.selectedIds.set(new Set(this.filteredMembers().map(r => r.id)));
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
    if (this.memberMenuPos()) {
      this.closeMemberMenu();
    }
    if (this.showMoreMenu()) {
      this.showMoreMenu.set(false);
    }
  }

  // === 成员右键菜单 ===
  onMemberContextMenu(event: MouseEvent, row: MemberRow) {
    event.preventDefault();
    this.closeContextMenu();
    this.memberMenuRow.set(row);
    this.memberMenuPos.set({ x: event.clientX, y: event.clientY });
  }

  closeMemberMenu() {
    this.memberMenuPos.set(null);
    this.memberMenuRow.set(null);
  }

  onEditMember() {
    const row = this.memberMenuRow();
    if (!row) return;
    this.closeMemberMenu();
    this.editingMemberId.set(row.id);
    this.editMemberName.set(row.name);
    this.editMemberMobile.set(row.mobile);
    this.showEditMemberDrawer.set(true);
  }

  onSetLeader() {
    const row = this.memberMenuRow();
    if (!row) return;
    this.closeMemberMenu();
    const companyId = this.auth.currentUser()?.companyId ?? '';
    this.organizeApi.setDeptLeader({ companyId, deptId: this.activeTreeId(), userId: row.id }).subscribe({
      next: () => this.loadMembers(this.activeTreeId()),
    });
  }

  onDeleteMember() {
    const row = this.memberMenuRow();
    if (!row) return;
    this.closeMemberMenu();
    this.deletingMember.set(row);
    this.deleteMemberMode.set('single');
    this.showDeleteMemberModal.set(true);
  }

  onTransferAndDelete() {
    const row = this.memberMenuRow();
    if (!row) return;
    this.closeMemberMenu();
    this.transferringMember.set(row);
    this.transferMode.set('transferAndDelete');
    this.transferTargetDeptId.set('');
    this.showTransferModal.set(true);
  }

  // === 添加人员 ===
  onAddMember() {
    this.showAddMemberDrawer.set(true);
  }

  onMemberAdded() {
    this.showAddMemberDrawer.set(false);
    this.loadMembers(this.activeTreeId());
  }

  // === 更多菜单 ===
  toggleMoreMenu() {
    this.showMoreMenu.update(v => !v);
  }

  onBatchImportExport() {
    this.showMoreMenu.set(false);
    this.showImportModal.set(true);
  }

  onImported() {
    this.showImportModal.set(false);
    this.loadMembers(this.activeTreeId());
  }

  onChangeDept() {
    this.showMoreMenu.set(false);
    if (this.selectedIds().size === 0) return;
    this.transferMode.set('change');
    this.transferringMember.set(null);
    this.transferTargetDeptId.set('');
    this.showTransferModal.set(true);
  }

  onEditColumns() {
    this.showMoreMenu.set(false);
    this.showColumnEditor.set(true);
  }

  onBatchResign() {
    this.showMoreMenu.set(false);
    if (this.selectedIds().size === 0) return;
    this.deleteMemberMode.set('batch');
    this.deletingMember.set(null);
    this.showDeleteMemberModal.set(true);
  }

  // === 编辑列表 ===
  toggleColumn(key: string) {
    this.visibleColumns.update(s => {
      const next = new Set(s);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  // === 删除成员 ===
  onDeleteMemberConfirmed() {
    const companyId = this.auth.currentUser()?.companyId ?? '';
    let userList: { userId?: string; deptId?: string; orgId?: string }[] = [];

    if (this.deleteMemberMode() === 'single') {
      const row = this.deletingMember();
      if (!row) return;
      userList = [{ userId: row.id, deptId: row.deptId, orgId: row.orgId }];
    } else {
      userList = this.members()
        .filter(m => this.selectedIds().has(m.id))
        .map(m => ({ userId: m.id, deptId: m.deptId, orgId: m.orgId }));
    }

    this.showDeleteMemberModal.set(false);
    this.memberApi.deleteMember({ companyId, userList }).subscribe({
      next: () => {
        this.deletingMember.set(null);
        this.selectedIds.set(new Set());
        this.loadMembers(this.activeTreeId());
      },
    });
  }

  // === 变更部门/资源转移 ===
  onTransferConfirmed() {
    const companyId = this.auth.currentUser()?.companyId ?? '';
    const targetDeptId = this.transferTargetDeptId();
    if (!targetDeptId) return;

    if (this.transferMode() === 'transferAndDelete') {
      const row = this.transferringMember();
      if (!row) return;
      this.showTransferModal.set(false);
      this.memberApi.transferMember({ companyId, oldDeptId: row.deptId, deptId: targetDeptId, userId: row.id }).subscribe({
        next: () => {
          this.memberApi.deleteMember({ companyId, userList: [{ userId: row.id, deptId: targetDeptId, orgId: row.orgId }] }).subscribe({
            next: () => this.loadMembers(this.activeTreeId()),
          });
        },
      });
    } else {
      // 批量变更部门
      const selected = this.members().filter(m => this.selectedIds().has(m.id));
      this.showTransferModal.set(false);
      let remaining = selected.length;
      selected.forEach(row => {
        this.memberApi.transferMember({ companyId, oldDeptId: row.deptId, deptId: targetDeptId, userId: row.id }).subscribe({
          next: () => {
            remaining--;
            if (remaining === 0) {
              this.selectedIds.set(new Set());
              this.loadMembers(this.activeTreeId());
            }
          },
        });
      });
    }
  }

  onTransferTreeSelect(node: TreeNode) {
    this.transferTargetDeptId.set(node.id);
  }

  // === 编辑人员信息 ===
  editingMemberId = signal<string | null>(null);
  editMemberName = signal('');
  editMemberMobile = signal('');
  showEditMemberDrawer = signal(false);

  onEditMemberSaved() {
    this.showEditMemberDrawer.set(false);
    this.loadMembers(this.activeTreeId());
  }

  // === 部门 CRUD ===
  onAddRootDept() {
    this.deptModalMode.set('create');
    this.deptFormName.set('');
    this.parentDeptId.set(this.auth.currentUser()?.companyId ??null);
    this.editingDeptId.set(null);
    this.showDeptModal.set(true);
  }

  onEditDept() {
    const node = this.contextMenuNode();
    if (!node) return;
    this.closeContextMenu();
    this.deptModalMode.set('edit');
    this.deptFormName.set(node.label);
    this.editingDeptId.set(node.id);
    this.parentDeptId.set(node.parentId ?? null);
    this.editingParentUri.set(node.parentUri ?? null);
    this.showDeptModal.set(true);
  }

  onAddChildDept() {
    const node = this.contextMenuNode();
    if (!node) return;
    this.closeContextMenu();
    this.deptModalMode.set('create');
    this.deptFormName.set('');
    this.parentDeptId.set(node.id);
    this.editingDeptId.set(null);
    this.showDeptModal.set(true);
  }

  onDeleteDept() {
    const node = this.contextMenuNode();
    this.closeContextMenu();
    if (!node) return;
    if (this.hasChildDept(node.id, this.treeItems())) {
      this.showChildDeptHint.set(true);
      return;
    }
    this.deletingNode.set(node);
    this.showDeleteModal.set(true);
  }

  private hasChildDept(id: string, items: TreeNode[]): boolean {
    for (const item of items) {
      if (item.id === id) return !!(item.children?.length);
      if (item.children?.length) {
        const found = this.hasChildDept(id, item.children);
        if (found) return true;
      }
    }
    return false;
  }

  onDeleteConfirmed() {
    const node = this.deletingNode();
    if (!node) return;
    this.showDeleteModal.set(false);
    this.deletingNode.set(null);
    const companyId = this.auth.currentUser()?.companyId ?? '';
    this.organizeApi.deleteOrganize({ id: node.id, companyId }).subscribe({
      next: () => this.loadOrganizeTree(),
    });
  }

  onDeptModalConfirm() {
    const name = this.deptFormName().trim();
    if (!name) return;
    const companyId = this.auth.currentUser()?.companyId ?? '';

    if (this.deptModalMode() === 'edit') {
      this.organizeApi.updateOrganize({ id: this.editingDeptId()!, name, companyId, parentId: this.parentDeptId() ?? undefined, parentUri: this.editingParentUri() ?? undefined }).subscribe({
        next: () => {
          this.showDeptModal.set(false);
          this.loadOrganizeTree();
        },
      });
    } else {
      this.organizeApi.createOrganize({ name, companyId, parentId: this.parentDeptId() ?? undefined }).subscribe({
        next: () => {
          this.showDeptModal.set(false);
          this.loadOrganizeTree();
        },
      });
    }
  }

  private convertOrgTree(nodes: TreeNodeOrganize[], parentUri?: string): TreeNode[] {
    return nodes.map(node => {
      const children = node.children?.length ? this.convertOrgTree(node.children, node.uri) : undefined;
      return {
        id: node.id ?? '',
        label: node.name ?? '',
        expanded: true,
        parentId: node.parentId,
        uri: node.uri,
        parentUri,
        children,
      };
    });
  }

  private findFirstLeaf(items: TreeNode[]): TreeNode {
    for (const item of items) {
      if (!item.children?.length) return item;
      return this.findFirstLeaf(item.children);
    }
    return items[0];
  }
}
