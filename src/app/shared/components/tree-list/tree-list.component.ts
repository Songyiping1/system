import { Component, input, output } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

export interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
  count?: number;
  expanded?: boolean;
  parentId?: string;
  uri?: string;
  parentUri?: string;
  type?: string;
}

@Component({
  selector: 'app-tree-list',
  standalone: true,
  imports: [NgTemplateOutlet],
  templateUrl: './tree-list.component.html',
  styleUrl: './tree-list.component.scss',
})
export class TreeListComponent {
  items = input<TreeNode[]>([]);
  activeId = input('');
  select = output<TreeNode>();
  contextMenu = output<{ node: TreeNode; event: MouseEvent }>();
  addAction = output<TreeNode>();

  onAddAction(node: TreeNode, event: MouseEvent) {
    event.stopPropagation();
    this.addAction.emit(node);
  }

  onSelect(node: TreeNode) {
    this.select.emit(node);
  }

  onContextMenu(node: TreeNode, event: MouseEvent) {
    event.preventDefault();
    this.contextMenu.emit({ node, event });
  }

  toggleExpand(node: TreeNode, event: Event) {
    event.stopPropagation();
    node.expanded = !node.expanded;
  }
}
