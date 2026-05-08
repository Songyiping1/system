import { Component, inject, signal, computed, OnInit, HostListener } from '@angular/core';
import { PageHeaderComponent, SearchInputComponent, SplitLayoutComponent, TreeListComponent, ActionBarComponent, ButtonComponent, ModalComponent, type TreeNode } from '../../shared/components';
import { type PageState } from '../../shared/models/page-state';
import { PositionApiService } from '../../api';
import { type PositionVo } from '../../api/types/position.type';
import { AuthService } from '../../services/auth.service';
import { PositionAddDrawerComponent } from './position-add-drawer/position-add-drawer.component';

interface PositionRow {
  id: string;
  name: string;
  avatar: string;
  jobNo: string;
  email: string;
  phone: string;
}

@Component({
  selector: 'app-position-manage',
  standalone: true,
  imports: [PageHeaderComponent, SearchInputComponent, SplitLayoutComponent, TreeListComponent, ActionBarComponent, ButtonComponent, ModalComponent, PositionAddDrawerComponent],
  templateUrl: './position-manage.component.html',
  styleUrl: './position-manage.component.scss',
})
export class PositionManageComponent implements OnInit {
  private positionApi = inject(PositionApiService);
  private auth = inject(AuthService);

  pageState = signal<PageState>('loading');
  searchKeyword = signal('');

  treeItems = signal<TreeNode[]>([]);
  activeTreeId = signal('');
  activePositionName = signal('');

  members = signal<PositionRow[]>([]);

  // 右键菜单
  contextMenuPos = signal<{ x: number; y: number } | null>(null);
  contextMenuNode = signal<TreeNode | null>(null);

  // 岗位抽屉
  showPositionDrawer = signal(false);
  positionDrawerEditMode = signal(false);
  editingPositionId = signal<string | null>(null);
  editingPositionName = signal('');
  editingPositionDeptId = signal<string | null>(null);
  editingPositionRoleIds = signal<string[]>([]);

  // 删除确认弹窗
  showDeleteModal = signal(false);
  deletingNode = signal<TreeNode | null>(null);

  isLoading = computed(() => this.pageState() === 'loading');
  totalCount = computed(() => this.members().length);

  filteredMembers = computed(() => {
    const keyword = this.searchKeyword().trim().toLowerCase();
    if (!keyword) return this.members();
    return this.members().filter(r =>
      r.name.toLowerCase().includes(keyword) ||
      r.jobNo.includes(keyword) ||
      r.phone.includes(keyword)
    );
  });

  ngOnInit() {
    this.loadPositionTree();
  }

  loadPositionTree() {
    this.pageState.set('loading');
    const companyId = this.auth.currentUser()?.companyId ?? '';
    this.positionApi.listPosition({ companyId }).subscribe({
      next: (res) => {
        const companyName = this.auth.currentUser()?.companyName || this.auth.currentUser()?.userName || '公司';
        const items: TreeNode[] = [{
          id: 'root',
          label: companyName,
          expanded: true,
          children: res.map(p => ({
            id: p.id ?? '',
            label: p.name ?? '',
          })),
        }];
        this.treeItems.set(items);
        if (res.length > 0) {
          this.activeTreeId.set(res[0].id ?? '');
          this.activePositionName.set(res[0].name ?? '');
          this.loadPositionUsers(res[0].id ?? '');
        }
        this.pageState.set(res.length > 0 ? 'normal' : 'empty');
      },
      error: () => this.pageState.set('error'),
    });
  }

  loadPositionUsers(positionId: string) {
    const companyId = this.auth.currentUser()?.companyId ?? '';
    this.positionApi.listPositionUser({ positionId, companyId }).subscribe({
      next: (res: any[]) => {
        this.members.set(res.map(u => ({
          id: u.userId ?? '',
          name: u.name ?? '',
          avatar: (u.name ?? '').charAt(0),
          jobNo: u.jobNo ?? '',
          email: u.email ?? '',
          phone: u.mobile ?? '',
        })));
      },
    });
  }

  onSearch(keyword: string) {
    this.searchKeyword.set(keyword);
  }

  onTreeSelect(node: TreeNode) {
    if (node.id === 'root') return;
    this.activeTreeId.set(node.id);
    this.activePositionName.set(node.label);
    this.loadPositionUsers(node.id);
  }

  // === 右键菜单 ===
  onTreeContextMenu(event: { node: TreeNode; event: MouseEvent }) {
    if (event.node.id === 'root') return;
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

  // === 岗位 CRUD ===
  onAddPosition() {
    this.positionDrawerEditMode.set(false);
    this.editingPositionId.set(null);
    this.editingPositionName.set('');
    this.editingPositionDeptId.set(null);
    this.editingPositionRoleIds.set([]);
    this.showPositionDrawer.set(true);
  }

  onEditPosition() {
    const node = this.contextMenuNode();
    if (!node) return;
    this.closeContextMenu();
    this.positionDrawerEditMode.set(true);
    this.editingPositionId.set(node.id);
    this.editingPositionName.set(node.label);
    this.editingPositionDeptId.set(null);
    this.editingPositionRoleIds.set([]);
    this.showPositionDrawer.set(true);
  }

  onPositionDrawerSaved() {
    this.showPositionDrawer.set(false);
    this.loadPositionTree();
  }

  onDeletePosition() {
    const node = this.contextMenuNode();
    this.closeContextMenu();
    if (!node) return;
    this.deletingNode.set(node);
    this.showDeleteModal.set(true);
  }

  onDeleteConfirmed() {
    const node = this.deletingNode();
    if (!node) return;
    this.showDeleteModal.set(false);
    this.deletingNode.set(null);
    const companyId = this.auth.currentUser()?.companyId ?? '';
    this.positionApi.removePosition({ id: node.id, companyId }).subscribe({
      next: () => this.loadPositionTree(),
    });
  }
}
