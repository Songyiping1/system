import { Component, signal, computed, HostListener } from '@angular/core';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { ActionBarComponent } from '../../shared/components/action-bar/action-bar.component';
import { SearchInputComponent } from '../../shared/components/search-input/search-input.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { CheckboxComponent } from '../../shared/components/checkbox/checkbox.component';
import { TypeBadgeComponent } from '../../shared/components/type-badge/type-badge.component';
import { ChildCountBadgeComponent } from '../../shared/components/child-count-badge/child-count-badge.component';
import { TreeNode } from '../../shared/models';
import { MenuDetailComponent } from './menu-detail/menu-detail.component';

interface FlatRow {
  node: TreeNode;
  level: number;
}

@Component({
  selector: 'app-menu-manage',
  imports: [PageHeaderComponent, ActionBarComponent, SearchInputComponent, ButtonComponent, CheckboxComponent, TypeBadgeComponent, ChildCountBadgeComponent, MenuDetailComponent],
  templateUrl: './menu-manage.html',
  styleUrl: './menu-manage.scss',
})
export class MenuManage {
  readonly searchValue = signal('');
  readonly selectedKeys = signal<string[]>([]);
  readonly expandedKeys = signal<string[]>(['3']);

  readonly treeData = signal<TreeNode[]>([
    { key: '1', data: { name: 'T度导向', description: '这是一段描述', type: 'muenu', position: 'Navigator', route: '-' } },
    { key: '2', data: { name: '项目管理', description: '这是一段描述', type: 'muenu', position: 'Navigator', route: '-' }, children: [
      { key: '2-1', data: { name: '子菜单1', description: '', type: 'muenu', position: 'Navigator', route: '/review' } },
    ]},
    { key: '3', data: { name: 'T度导向', description: '这是一段描述', type: 'muenu', position: 'Navigator', route: '-' }, children: [
      { key: '3-1', data: { name: 'T度导向', description: '这是一段描述', type: 'muenu', position: 'Navigator', route: '/review' }, children: [
        { key: '3-1-1', data: { name: 'T度导向', description: '这是一段描述', type: 'muenu', position: 'Navigator', route: '-' } },
        { key: '3-1-2', data: { name: 'T度导向', description: '这是一段描述', type: 'muenu', position: 'Navigator', route: '-' } },
      ]},
      { key: '3-2', data: { name: 'T度导向', description: '这是一段描述', type: 'muenu', position: 'Navigator', route: '/release' } },
    ]},
    { key: '4', data: { name: 'T度导向', description: '这是一段描述', type: 'label', position: 'HomePage', route: '/video-subtitle' } },
    { key: '5', data: { name: 'T度导向', description: '这是一段描述', type: 'muenu', position: 'HomePage', route: '/recommend' } },
    { key: '6', data: { name: 'T度导向', description: '这是一段描述', type: 'label', position: 'HomePage', route: '-' } },
    { key: '7', data: { name: 'T度导向', description: '这是一段描述', type: 'label', position: 'Navigator', route: '-' } },
    { key: '8', data: { name: 'T度导向', description: '这是一段描述', type: 'muenu', position: 'Navigator', route: '-' } },
    { key: '9', data: { name: 'T度导向', description: '这是一段描述', type: 'muenu', position: 'Navigator', route: '-' } },
  ]);

  readonly flattenedRows = computed<FlatRow[]>(() => {
    const rows: FlatRow[] = [];
    const expanded = new Set(this.expandedKeys());
    const flatten = (nodes: TreeNode[], level: number) => {
      for (const node of nodes) {
        rows.push({ node, level });
        if (node.children?.length && expanded.has(node.key)) {
          flatten(node.children, level + 1);
        }
      }
    };
    flatten(this.treeData(), 0);
    return rows;
  });

  isExpanded(key: string): boolean {
    return this.expandedKeys().includes(key);
  }

  isSelected(key: string): boolean {
    return this.selectedKeys().includes(key);
  }

  getIndent(level: number): number[] {
    return Array.from({ length: level }, (_, i) => i);
  }

  toggleExpand(key: string): void {
    const keys = this.expandedKeys();
    if (keys.includes(key)) {
      this.expandedKeys.set(keys.filter(k => k !== key));
    } else {
      this.expandedKeys.set([...keys, key]);
    }
  }

  toggleSelect(key: string): void {
    const keys = this.selectedKeys();
    if (keys.includes(key)) {
      this.selectedKeys.set(keys.filter(k => k !== key));
    } else {
      this.selectedKeys.set([...keys, key]);
    }
  }

  readonly showDetail = signal(false);

  onRowClick(key: string): void {
    this.showDetail.set(true);
  }

  readonly contextMenu = signal<{ x: number; y: number; key: string } | null>(null);

  @HostListener('document:click')
  onDocumentClick(): void {
    this.contextMenu.set(null);
  }

  onRowContextMenu(event: MouseEvent, key: string): void {
    event.preventDefault();
    this.contextMenu.set({ x: event.clientX, y: event.clientY, key });
  }

  onContextAction(action: string): void {
    const menu = this.contextMenu();
    if (!menu) return;
    this.contextMenu.set(null);
    // TODO: handle action
  }
}
