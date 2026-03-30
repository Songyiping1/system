import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { PageHeaderComponent, SearchInputComponent, ActionBarComponent, ButtonComponent, ModalComponent } from '../../shared/components';
import { type PageState } from '../../shared/models/page-state';
import { MenuApiService } from '../../api';
import { type TreeNodeMenu, type Menu } from '../../api/types/menu.type';
import { MenuDetailDrawerComponent } from './menu-detail-drawer/menu-detail-drawer.component';

export interface MenuItem {
  id: string;
  name: string;
  desc: string;
  code: string;
  type: 'menu' | 'label';
  position: string;
  route: string;
  parentId: string;
  path: string;
  order: number;
  children?: MenuItem[];
  expanded?: boolean;
  childCount?: number;
}

@Component({
  selector: 'app-menu-manage',
  standalone: true,
  imports: [PageHeaderComponent, SearchInputComponent, ActionBarComponent, ButtonComponent, MenuDetailDrawerComponent, ModalComponent],
  templateUrl: './menu-manage.component.html',
  styleUrl: './menu-manage.component.scss',
})
export class MenuManageComponent implements OnInit {
  private menuApi = inject(MenuApiService);

  pageState = signal<PageState>('loading');
  searchKeyword = signal('');
  selectedIds = signal<Set<string>>(new Set());
  menuData = signal<MenuItem[]>([]);

  // Drawer state
  showDrawer = signal(false);
  editMenuId = signal<string | null>(null);
  deleteModalVisible = signal(false);

  // Drag state
  dragItem = signal<MenuItem | null>(null);
  dragOverIndex = signal<number | null>(null);
  dragPosition = signal<'before' | 'after' | 'child'>('after');

  flatRows = computed(() => {
    const rows: { item: MenuItem; level: number }[] = [];
    const walk = (items: MenuItem[], level: number) => {
      for (const item of items) {
        rows.push({ item, level });
        if (item.expanded && item.children?.length) {
          walk(item.children, level + 1);
        }
      }
    };
    walk(this.menuData(), 0);
    return rows;
  });

  isLoading = computed(() => this.pageState() === 'loading');
  allSelected = computed(() => {
    const ids = this.selectedIds();
    return this.flatRows().length > 0 && this.flatRows().every(r => ids.has(r.item.id));
  });

  ngOnInit() {
    this.loadMenuTree();
  }

  /** 收集当前展开的节点 ID */
  private collectExpandedIds(items: MenuItem[]): Set<string> {
    const ids = new Set<string>();
    const walk = (list: MenuItem[]) => {
      for (const item of list) {
        if (item.expanded) ids.add(item.id);
        if (item.children?.length) walk(item.children);
      }
    };
    walk(items);
    return ids;
  }

  /** 恢复展开状态 */
  private restoreExpanded(items: MenuItem[], expandedIds: Set<string>) {
    for (const item of items) {
      if (expandedIds.has(item.id)) item.expanded = true;
      if (item.children?.length) this.restoreExpanded(item.children, expandedIds);
    }
  }

  /** 加载菜单树 */
  loadMenuTree() {
    const expandedIds = this.collectExpandedIds(this.menuData());
    this.pageState.set('loading');
    this.menuApi.loadMenuTree().subscribe({
      next: (res) => {
        const items = this.convertTree(res);
        this.restoreExpanded(items, expandedIds);
        this.menuData.set(items);
        this.pageState.set(items.length > 0 ? 'normal' : 'empty');
      },
      error: () => {
        this.pageState.set('error');
      },
    });
  }

  /** 搜索 */
  onSearch(keyword: string) {
    this.searchKeyword.set(keyword);
  }

  /** 新建菜单 */
  onCreateMenu() {
    this.editMenuId.set(null);
    this.showDrawer.set(true);
  }

  /** 点击行查看详情 */
  onRowClick(item: MenuItem) {
    this.editMenuId.set(item.id);
    this.showDrawer.set(true);
  }

  /** 抽屉保存后刷新 */
  onDrawerSaved() {
    this.loadMenuTree();
  }

  /** 删除选中菜单 */
  onDeleteSelected() {
    if (this.selectedIds().size === 0) return;
    this.deleteModalVisible.set(true);
  }

  onDeleteConfirmed() {
    this.deleteModalVisible.set(false);
    const ids = Array.from(this.selectedIds());
    this.menuApi.removeMenu({ ids }).subscribe({
      next: () => {
        this.selectedIds.set(new Set());
        this.loadMenuTree();
      },
    });
  }

  onDeleteCancelled() {
    this.deleteModalVisible.set(false);
  }

  toggleExpand(item: MenuItem) {
    item.expanded = !item.expanded;
    this.menuData.update(d => [...d]);
  }

  toggleSelect(id: string) {
    const item = this.findMenuItem(this.menuData(), id);
    if (!item) return;
    const checked = !this.selectedIds().has(id);
    this.selectedIds.update(s => {
      const next = new Set(s);
      if (checked) {
        next.add(id);
        this.addChildIds(item, next);
      } else {
        next.delete(id);
        this.removeChildIds(item, next);
      }
      return next;
    });
  }

  toggleAll() {
    if (this.allSelected()) {
      this.selectedIds.set(new Set());
    } else {
      this.selectedIds.set(new Set(this.flatRows().map(r => r.item.id)));
    }
  }

  isSelected(id: string): boolean {
    return this.selectedIds().has(id);
  }

  /** 子节点是否被父节点锁定（父节点选中时子节点不可取消） */
  isLockedByParent(id: string): boolean {
    return this.lockedIds().has(id);
  }

  /** 所有被父节点锁定的子节点 ID */
  lockedIds = computed(() => {
    const locked = new Set<string>();
    const selected = this.selectedIds();
    const walk = (items: MenuItem[]) => {
      for (const item of items) {
        if (selected.has(item.id) && item.children?.length) {
          this.collectAllChildIds(item, locked);
        }
        if (item.children?.length) walk(item.children);
      }
    };
    walk(this.menuData());
    return locked;
  });

  private addChildIds(item: MenuItem, ids: Set<string>) {
    if (item.children?.length) {
      for (const child of item.children) {
        ids.add(child.id);
        this.addChildIds(child, ids);
      }
    }
  }

  private removeChildIds(item: MenuItem, ids: Set<string>) {
    if (item.children?.length) {
      for (const child of item.children) {
        ids.delete(child.id);
        this.removeChildIds(child, ids);
      }
    }
  }

  private collectAllChildIds(item: MenuItem, ids: Set<string>) {
    if (item.children?.length) {
      for (const child of item.children) {
        ids.add(child.id);
        this.collectAllChildIds(child, ids);
      }
    }
  }

  private findMenuItem(items: MenuItem[], id: string): MenuItem | null {
    for (const item of items) {
      if (item.id === id) return item;
      if (item.children?.length) {
        const found = this.findMenuItem(item.children, id);
        if (found) return found;
      }
    }
    return null;
  }

  // ===== 拖拽 =====
  onDragStart(event: DragEvent, item: MenuItem) {
    event.stopPropagation();
    this.dragItem.set(item);
    event.dataTransfer!.effectAllowed = 'move';
  }

  onDragOver(event: DragEvent, index: number) {
    event.preventDefault();
    event.stopPropagation();
    const drag = this.dragItem();
    if (!drag) return;

    const row = this.flatRows()[index];
    if (row.item.id === drag.id) return;

    event.dataTransfer!.dropEffect = 'move';
    this.dragOverIndex.set(index);

    // 根据鼠标在行内的位置判断放置方式
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const y = event.clientY - rect.top;
    const ratio = y / rect.height;

    if (ratio < 0.33) {
      this.dragPosition.set('before');
    } else if (ratio > 0.67) {
      this.dragPosition.set('after');
    } else {
      this.dragPosition.set('child');
    }
  }

  onDragLeave(event: DragEvent) {
    event.stopPropagation();
    this.dragOverIndex.set(null);
  }

  onDrop(event: DragEvent, index: number) {
    event.preventDefault();
    event.stopPropagation();

    const drag = this.dragItem();
    const rows = this.flatRows();
    const targetRow = rows[index];
    if (!drag || targetRow.item.id === drag.id) {
      this.resetDrag();
      return;
    }

    const position = this.dragPosition();
    let parentId: string;
    let parentPath: string;
    let preOrder: number;

    if (position === 'child') {
      // 放入目标内部作为子节点（末尾）
      parentId = targetRow.item.id;
      parentPath = targetRow.item.path ?? '';
      const lastChild = targetRow.item.children?.[targetRow.item.children.length - 1];
      preOrder = lastChild ? lastChild.order : 0;
    } else {
      // 放在目标同级
      parentId = targetRow.item.parentId;
      parentPath = this.findParentPath(rows, index, targetRow.level);

      if (position === 'before') {
        const prevSibling = this.findPrevSibling(rows, index, targetRow.level);
        preOrder = prevSibling ? prevSibling.order : 0;
      } else {
        preOrder = targetRow.item.order;
      }
    }

    this.menuApi.dragMenu({
      id: drag.id,
      code: drag.code,
      parentId,
      parentPath: parentId === '0' ? null : parentPath,
      preOrder,
    } as any).subscribe({
      next: () => this.loadMenuTree(),
    });

    this.resetDrag();
  }

  onDragEnd() {
    this.resetDrag();
  }

  private resetDrag() {
    this.dragItem.set(null);
    this.dragOverIndex.set(null);
  }

  /** 从 flatRows 向上找到父节点，返回其 path */
  private findParentPath(rows: { item: MenuItem; level: number }[], index: number, level: number): string {
    if (level === 0) return '';
    for (let i = index - 1; i >= 0; i--) {
      if (rows[i].level === level - 1) {
        return rows[i].item.path ?? '';
      }
    }
    return '';
  }

  private findPrevSibling(rows: { item: MenuItem; level: number }[], index: number, level: number): MenuItem | null {
    for (let i = index - 1; i >= 0; i--) {
      if (rows[i].level === level) return rows[i].item;
      if (rows[i].level < level) break;
    }
    return null;
  }

  /** 将后端菜单节点转换为页面 MenuItem[] */
  private convertTree(nodes: any[]): MenuItem[] {
    return nodes.map(node => {
      const menu = node as Menu;
      const children = node.children?.length ? this.convertTree(node.children) : undefined;
      return {
        id: menu.id ?? '',
        name: menu.name ?? '',
        desc: menu.description ?? '',
        code: menu.code ?? '',
        type: (menu.menuType?.toLowerCase() === 'label' ? 'label' : 'menu') as 'menu' | 'label',
        position: menu.position ?? '',
        route: menu.route || '-',
        parentId: menu.parentId ?? '0',
        path: menu.path ?? '',
        order: menu.order ?? 0,
        children,
        expanded: false,
        childCount: node.children?.length ?? 0,
      };
    });
  }
}
