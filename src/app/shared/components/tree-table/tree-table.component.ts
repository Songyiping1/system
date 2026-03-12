import { Component, input, output, computed, signal } from '@angular/core';

import { ColumnDef, TreeNode } from '../../models';
import { CheckboxComponent } from '../checkbox/checkbox.component';
import { ChildCountBadgeComponent } from '../child-count-badge/child-count-badge.component';
import { DataTableComponent } from '../data-table/data-table.component';

interface FlattenedRow {
  node: TreeNode;
  level: number;
}

@Component({
  selector: 'app-tree-table',
  templateUrl: './tree-table.component.html',
  styleUrl: './tree-table.component.scss',
  imports: [
    CheckboxComponent,
    ChildCountBadgeComponent,
    DataTableComponent,
  ],
})
export class TreeTableComponent {
  readonly columns = input<ColumnDef[]>([]);
  readonly data = input<TreeNode[]>([]);
  readonly expandedKeys = input<string[]>([]);
  readonly selectedKeys = input<string[]>([]);
  readonly selectable = input<boolean>(true);

  readonly expandedKeysChange = output<string[]>();
  readonly selectedKeysChange = output<string[]>();
  readonly nodeClick = output<TreeNode>();

  readonly visibleRows = computed<FlattenedRow[]>(() => {
    const rows: FlattenedRow[] = [];
    const expanded = new Set(this.expandedKeys());

    const flatten = (nodes: TreeNode[], level: number) => {
      for (const node of nodes) {
        rows.push({ node, level });
        if (node.children?.length && expanded.has(node.key)) {
          flatten(node.children, level + 1);
        }
      }
    };

    flatten(this.data(), 0);
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
    const updated = keys.includes(key)
      ? keys.filter(k => k !== key)
      : [...keys, key];
    this.expandedKeysChange.emit(updated);
  }

  toggleSelect(key: string): void {
    const keys = this.selectedKeys();
    const updated = keys.includes(key)
      ? keys.filter(k => k !== key)
      : [...keys, key];
    this.selectedKeysChange.emit(updated);
  }

  onRowClick(node: TreeNode): void {
    this.nodeClick.emit(node);
  }

  onAdd(node: TreeNode): void {
    // Placeholder for add action
  }
}
