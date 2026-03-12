import { Component, signal, computed } from '@angular/core';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { ActionBarComponent } from '../../shared/components/action-bar/action-bar.component';
import { SearchInputComponent } from '../../shared/components/search-input/search-input.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { CompanyIconComponent } from '../../shared/components/company-icon/company-icon.component';
import { StatsCardRowComponent } from '../../shared/components/stats-card-row/stats-card-row.component';
import { StatsCard, TreeNode } from '../../shared/models';

interface FlatRow {
  node: TreeNode;
  level: number;
}

@Component({
  selector: 'app-group-hierarchy',
  imports: [PageHeaderComponent, ActionBarComponent, SearchInputComponent, ButtonComponent, CompanyIconComponent, StatsCardRowComponent],
  templateUrl: './group-hierarchy.html',
  styleUrl: './group-hierarchy.scss',
})
export class GroupHierarchy {
  readonly searchValue = signal('');

  readonly statsCards = signal<StatsCard[]>([
    { label: '上级组织', value: 2, clickable: true },
    { label: '下级组织', value: 25, clickable: true },
    { label: '本组织人数', value: 54, clickable: true },
    { label: '直属下级组织人数合', value: 1244, clickable: true },
  ]);

  readonly expandedKeys = signal<string[]>(['1', '1-1']);

  readonly treeData = signal<TreeNode[]>([
    {
      key: '1',
      data: { name: '天诚', iconColor: '#2e67f4', count: 124, department: '设计部', status: '正常', statusType: 'normal' },
      children: [
        {
          key: '1-1',
          data: { name: '天诚', iconColor: '#2e67f4', count: 124, department: '开发部', status: '已停用', statusType: 'disabled' },
          children: [
            {
              key: '1-1-1',
              data: { name: '浩森集团', iconColor: '#666', count: 124, department: '设计部', status: '正常', statusType: 'normal', highlighted: true },
            },
          ],
        },
      ],
    },
    { key: '2', data: { name: 'ACE Studio', iconColor: '#2e67f4', count: 124, department: '设计部', status: '已注销', statusType: 'cancelled' } },
    { key: '3', data: { name: 'FOCO', iconColor: '#666', count: 124, department: '设计部', status: '已注销', statusType: 'cancelled' } },
    { key: '4', data: { name: '天格环慧', iconColor: '#12b76a', count: 124, department: '设计部', status: '正常', statusType: 'normal' } },
    { key: '5', data: { name: 'Painting', iconColor: '#999', count: 124, department: '设计部', status: '正常', statusType: 'normal' } },
    { key: '6', data: { name: 'miniCo', iconColor: '#2e67f4', count: 124, department: '设计部', status: '正常', statusType: 'normal' } },
    { key: '7', data: { name: '华通电力', iconColor: '#2e67f4', count: 124, department: '设计部', status: '正常', statusType: 'normal' } },
    { key: '8', data: { name: '思华集团', iconColor: '#12b76a', count: 124, department: '设计部', status: '正常', statusType: 'normal' } },
    { key: '9', data: { name: '国药集团', iconColor: '#12b76a', count: 124, department: '设计部', status: '正常', statusType: 'normal' } },
    { key: '10', data: { name: '国控星鲨', iconColor: '#2e67f4', count: 124, department: '设计部', status: '正常', statusType: 'normal' } },
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

  onStatsCardClick(card: StatsCard): void {
    console.log('Stats card clicked:', card.label);
  }
}
