import { Component, input, output } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

export interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
  count?: number;
  expanded?: boolean;
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

  onSelect(node: TreeNode) {
    this.select.emit(node);
  }

  toggleExpand(node: TreeNode, event: Event) {
    event.stopPropagation();
    node.expanded = !node.expanded;
  }
}
