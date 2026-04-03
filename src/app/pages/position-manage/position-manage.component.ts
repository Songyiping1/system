import { Component, inject, signal, computed, OnInit, HostListener } from '@angular/core';
import { PageHeaderComponent, SearchInputComponent, SplitLayoutComponent, TreeListComponent, ActionBarComponent, ButtonComponent, ModalComponent, type TreeNode } from '../../shared/components';
import { type PageState } from '../../shared/models/page-state';
import { PositionApiService } from '../../api';
import { type PositionVo } from '../../api/types/position.type';
import { AuthService } from '../../services/auth.service';

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
  imports: [PageHeaderComponent, SearchInputComponent, SplitLayoutComponent, TreeListComponent, ActionBarComponent, ButtonComponent, ModalComponent],
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

  // 岗位弹窗
  showPositionModal = signal(false);
  positionModalMode = signal<'create' | 'edit'>('create');
  positionFormName = signal('');
  editingPositionId = signal<string | null>(null);

  // 删除确认弹窗
  showDeleteModal = signal(false);

  isLoading = computed(() => this.pageState() === 'loading');
  totalCount = computed(() => this.members().length);
  positionModalTitle = computed(() => this.positionModalMode() === 'create' ? '新建岗位' : '编辑岗位');

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
        const companyName = this.auth.currentUser()?.userName ?? '公司';
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
    this.positionModalMode.set('create');
    this.positionFormName.set('');
    this.editingPositionId.set(null);
    this.showPositionModal.set(true);
  }

  onEditPosition() {
    const node = this.contextMenuNode();
    if (!node) return;
    this.closeContextMenu();
    this.positionModalMode.set('edit');
    this.positionFormName.set(node.label);
    this.editingPositionId.set(node.id);
    this.showPositionModal.set(true);
  }

  onDeletePosition() {
    this.closeContextMenu();
    this.showDeleteModal.set(true);
  }

  onDeleteConfirmed() {
    const node = this.contextMenuNode();
    if (!node) return;
    this.showDeleteModal.set(false);
    const companyId = this.auth.currentUser()?.companyId ?? '';
    this.positionApi.removePosition({ id: node.id, companyId }).subscribe({
      next: () => this.loadPositionTree(),
    });
  }

  onPositionModalConfirm() {
    const name = this.positionFormName().trim();
    if (!name) return;
    const companyId = this.auth.currentUser()?.companyId ?? '';

    if (this.positionModalMode() === 'edit') {
      this.positionApi.updatePosition({ id: this.editingPositionId()!, name, companyId }).subscribe({
        next: () => {
          this.showPositionModal.set(false);
          this.loadPositionTree();
        },
      });
    } else {
      this.positionApi.createPosition({ name, companyId }).subscribe({
        next: () => {
          this.showPositionModal.set(false);
          this.loadPositionTree();
        },
      });
    }
  }
}
