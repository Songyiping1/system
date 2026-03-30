import { Component, input, output, signal, computed, inject, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MenuApiService } from '../../../api';
import { type MenuUpsertCommand, type TreeNodeMenu, type Menu } from '../../../api/types/menu.type';

export type MenuType = 'MENU' | 'LABEL' | 'BUTTON';

export interface ParentMenuOption {
  id: string;
  name: string;
  level: number;
  hasChildren: boolean;
  expanded: boolean;
  children: ParentMenuOption[];
}

/** 位置下拉固定选项 */
const POSITION_OPTIONS = ['HomePage', 'Header', 'Navigator', 'RightPanel'];

@Component({
  selector: 'app-menu-detail-drawer',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './menu-detail-drawer.component.html',
  styleUrl: './menu-detail-drawer.component.scss',
})
export class MenuDetailDrawerComponent {
  private menuApi = inject(MenuApiService);


  visible = input(false);
  editId = input<string | null>(null);
  parentId = input<string | null>(null);

  closed = output<void>();
  saved = output<void>();

  name = signal('');
  description = signal('');
  code = signal('');
  selectedParentId = signal<string | null>(null);
  parentMenuLabel = signal('-');
  icon = signal('');
  menuType = signal<MenuType>('MENU');
  position = signal('Navigator');
  route = signal('');

  /** 位置下拉 */
  positionOptions = POSITION_OPTIONS;
  positionDropdownOpen = signal(false);

  /** 上级菜单下拉 */
  parentDropdownOpen = signal(false);
  parentMenuTree = signal<ParentMenuOption[]>([]);

  /** 扁平化后的上级菜单列表（用于渲染） */
  flatParentMenus = computed(() => {
    const result: ParentMenuOption[] = [];
    const walk = (items: ParentMenuOption[], level: number) => {
      for (const item of items) {
        result.push({ ...item, level });
        if (item.expanded && item.children.length) {
          walk(item.children, level + 1);
        }
      }
    };
    walk(this.parentMenuTree(), 0);
    return result;
  });

  isEdit = computed(() => !!this.editId());
  title = computed(() => this.isEdit() ? '菜单详情' : '新建菜单');

  canSave = computed(() =>
    this.name().trim().length > 0 && this.code().trim().length > 0
  );

  constructor() {
    effect(() => {
      if (this.visible()) {
        this.loadParentMenuTree();
        const id = this.editId();
        if (id) {
          this.loadMenuDetail(id);
        }
      }
    });
  }

  closeAllDropdowns() {
    this.positionDropdownOpen.set(false);
    this.parentDropdownOpen.set(false);
  }

  /** 加载上级菜单树 */
  loadParentMenuTree() {
    this.menuApi.loadMenuTree().subscribe({
      next: (res) => {
        this.parentMenuTree.set(this.convertMenuTree(res));
      },
    });
  }

  /** 加载菜单详情 */
  loadMenuDetail(menuId: string) {
    this.menuApi.getMenuDetail({ id: menuId }).subscribe({
      next: (res) => {
        this.name.set(res.name ?? '');
        this.description.set(res.description ?? '');
        this.code.set(res.code ?? '');
        this.icon.set(res.icon?.uri ?? '');
        this.menuType.set((res.menuType as MenuType) ?? 'MENU');
        this.position.set(res.position ?? 'Navigator');
        this.route.set(res.route ?? '');
        if (res.parentId && res.parentId !== '0') {
          this.selectedParentId.set(res.parentId);
          this.parentMenuLabel.set(this.findMenuName(this.parentMenuTree(), res.parentId) ?? res.parentId);
        } else {
          this.selectedParentId.set(null);
          this.parentMenuLabel.set('-');
        }
      },
    });
  }

  /** 在树中查找菜单名称 */
  private findMenuName(nodes: ParentMenuOption[], id: string): string | null {
    for (const node of nodes) {
      if (node.id === id) return node.name;
      if (node.children.length) {
        const found = this.findMenuName(node.children, id);
        if (found) return found;
      }
    }
    return null;
  }

  /** 位置下拉切换 */
  togglePositionDropdown(event: MouseEvent) {
    event.stopPropagation();
    this.parentDropdownOpen.set(false);
    this.positionDropdownOpen.update(v => !v);
  }

  /** 选择位置 */
  selectPosition(option: string) {
    this.position.set(option);
    this.positionDropdownOpen.set(false);
  }

  /** 上级菜单下拉切换 */
  toggleParentDropdown(event: MouseEvent) {
    event.stopPropagation();
    this.positionDropdownOpen.set(false);
    this.parentDropdownOpen.update(v => !v);
  }

  /** 选择上级菜单 */
  selectParentMenu(item: ParentMenuOption) {
    this.selectedParentId.set(item.id);
    this.parentMenuLabel.set(item.name);
    this.parentDropdownOpen.set(false);
  }

  /** 展开/收起上级菜单子级 */
  toggleParentExpand(event: MouseEvent, item: ParentMenuOption) {
    event.stopPropagation();
    this.parentMenuTree.update(tree => {
      this.toggleNodeExpand(tree, item.id);
      return [...tree];
    });
  }

  onClose() {
    this.reset();
    this.closed.emit();
  }

  onSave() {
    if (!this.canSave()) return;

    const body: MenuUpsertCommand = {
      name: this.name(),
      description: this.description(),
      code: this.code(),
      parentId: this.selectedParentId() ?? '0',
      menuType: this.menuType(),
      route: this.route(),
      position: this.position(),
    };

    if (this.isEdit()) {
      body.id = this.editId()!;
      this.menuApi.updateMenu(body).subscribe({
        next: () => {
          this.saved.emit();
          this.onClose();
        },
      });
    } else {
      this.menuApi.createMenu(body).subscribe({
        next: () => {
          this.saved.emit();
          this.onClose();
        },
      });
    }
  }

  private reset() {
    this.name.set('');
    this.description.set('');
    this.code.set('');
    this.selectedParentId.set(null);
    this.parentMenuLabel.set('-');
    this.icon.set('');
    this.menuType.set('MENU');
    this.position.set('Navigator');
    this.route.set('');
    this.positionDropdownOpen.set(false);
    this.parentDropdownOpen.set(false);
  }

  private convertMenuTree(nodes: any[]): ParentMenuOption[] {
    return nodes.map(node => {
      const menu = node as Menu;
      return {
        id: menu.id ?? '',
        name: menu.name ?? '',
        level: 0,
        hasChildren: (node.children?.length ?? 0) > 0,
        expanded: false,
        children: node.children?.length ? this.convertMenuTree(node.children) : [],
      };
    });
  }

  private toggleNodeExpand(nodes: ParentMenuOption[], id: string): boolean {
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
