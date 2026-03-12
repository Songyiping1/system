import { Component, signal, computed } from '@angular/core';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { ActionBarComponent } from '../../shared/components/action-bar/action-bar.component';
import { SearchInputComponent } from '../../shared/components/search-input/search-input.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { CheckboxComponent } from '../../shared/components/checkbox/checkbox.component';
import { CompanyIconComponent } from '../../shared/components/company-icon/company-icon.component';
import { TreeNode } from '../../shared/models';

interface FlatRow {
  node: TreeNode;
  level: number;
}

@Component({
  selector: 'app-company-resource',
  imports: [PageHeaderComponent, ActionBarComponent, SearchInputComponent, ButtonComponent, CheckboxComponent, CompanyIconComponent],
  templateUrl: './company-resource.html',
  styleUrl: './company-resource.scss',
})
export class CompanyResource {
  readonly searchValue = signal('');
  readonly selectedKeys = signal<string[]>([]);
  readonly expandedKeys = signal<string[]>([]);

  readonly treeData = signal<TreeNode[]>([
    { key: 'runtong', data: { name: '润通求本', shortName: '润通', count: 26, phone: '15147888855', iconColor: '#f59e0b' }, children: [
      { key: 'dev', data: { name: '开发部', shortName: '-', count: 12, phone: '15147888855', iconColor: '#2e67f4' }, children: [
        { key: 'dev-1', data: { name: '开发部_1组', shortName: '-', count: 33, phone: '15147888855', iconColor: '#2e67f4' } },
        { key: 'dev-2', data: { name: '开发部_2组', shortName: '-', count: 34, phone: '15147888855', iconColor: '#2e67f4' } },
      ]},
    ]},
    { key: 'foco', data: { name: 'FOCO', shortName: 'FO', count: 12, phone: '15147888855', iconColor: '#666' } },
    { key: 'tiange', data: { name: '天格环基', shortName: '天格', count: 31, phone: '15147888855', iconColor: '#12b76a' } },
    { key: 'painting', data: { name: 'Painting', shortName: '涂庭', count: 24, phone: '15147888855', iconColor: '#999' } },
    { key: 'minico', data: { name: 'miniCo', shortName: '米妮冠', count: 353, phone: '15147888855', iconColor: '#2e67f4' } },
    { key: 'huatong', data: { name: '华通电力', shortName: '华通', count: 56, phone: '15147888855', iconColor: '#2e67f4' } },
    { key: 'sihua', data: { name: '思华集团', shortName: '思华', count: 335, phone: '15147888855', iconColor: '#12b76a' } },
    { key: 'guoyao', data: { name: '国药集团', shortName: '国药', count: 7121, phone: '15147888855', iconColor: '#12b76a' } },
    { key: 'guokong', data: { name: '国控星鲨', shortName: '星鲨', count: 6542, phone: '15147888855', iconColor: '#2e67f4' } },
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

  readonly allKeys = computed(() => this.flattenedRows().map(r => r.node.key));

  readonly selectAll = computed(() => {
    const keys = this.selectedKeys();
    const all = this.allKeys();
    return all.length > 0 && keys.length === all.length;
  });

  readonly indeterminate = computed(() => {
    const keys = this.selectedKeys();
    const all = this.allKeys();
    return keys.length > 0 && keys.length < all.length;
  });

  toggleSelectAll(): void {
    if (this.selectAll()) {
      this.selectedKeys.set([]);
    } else {
      this.selectedKeys.set(this.allKeys());
    }
  }

  toggleRow(key: string): void {
    const keys = this.selectedKeys();
    if (keys.includes(key)) {
      this.selectedKeys.set(keys.filter(k => k !== key));
    } else {
      this.selectedKeys.set([...keys, key]);
    }
  }

  isSelected(key: string): boolean {
    return this.selectedKeys().includes(key);
  }

  isExpanded(key: string): boolean {
    return this.expandedKeys().includes(key);
  }

  toggleExpand(key: string): void {
    const keys = this.expandedKeys();
    if (keys.includes(key)) {
      this.expandedKeys.set(keys.filter(k => k !== key));
    } else {
      this.expandedKeys.set([...keys, key]);
    }
  }

  getIndent(level: number): number[] {
    return Array.from({ length: level }, (_, i) => i);
  }
}
