import { Component, signal, computed } from '@angular/core';
import { PageHeaderComponent, SearchInputComponent, ActionBarComponent, ButtonComponent } from '../../shared/components';
import { type PageState } from '../../shared/models/page-state';

export interface MenuItem {
  id: string;
  name: string;
  desc: string;
  type: 'menu' | 'label';
  position: string;
  route: string;
  children?: MenuItem[];
  expanded?: boolean;
  childCount?: number;
}

@Component({
  selector: 'app-menu-manage',
  standalone: true,
  imports: [PageHeaderComponent, SearchInputComponent, ActionBarComponent, ButtonComponent],
  templateUrl: './menu-manage.component.html',
  styleUrl: './menu-manage.component.scss',
})
export class MenuManageComponent {
  pageState = signal<PageState>('normal');
  searchKeyword = signal('');
  selectedIds = signal<Set<string>>(new Set());

  menuData = signal<MenuItem[]>([
    {
      id: '1', name: 'T度导向', desc: '这是一段描述', type: 'menu', position: 'Navigator', route: '-',
    },
    {
      id: '2', name: '项目管理', desc: '这是一段描述', type: 'menu', position: 'Navigator', route: '-',
      childCount: 2,
    },
    {
      id: '3', name: 'T度导向', desc: '这是一段描述', type: 'menu', position: 'Navigator', route: '-',
      expanded: true, childCount: 2,
      children: [
        {
          id: '3-1', name: 'T度导向', desc: '这是一段描述', type: 'menu', position: 'Navigator', route: '/review',
          childCount: 2,
        },
        {
          id: '3-2', name: 'T度导向', desc: '这是一段描述', type: 'menu', position: 'Navigator', route: '/release',
        },
      ],
    },
    {
      id: '4', name: 'T度导向', desc: '这是一段描述', type: 'label', position: 'HomePage', route: '/video-subtitle',
    },
    {
      id: '5', name: 'T度导向', desc: '这是一段描述', type: 'menu', position: 'HomePage', route: '/recommend',
      childCount: 2,
    },
    {
      id: '6', name: 'T度导向', desc: '这是一段描述', type: 'label', position: 'HomePage', route: '-',
      childCount: 2,
    },
    {
      id: '7', name: 'T度导向', desc: '这是一段描述', type: 'label', position: 'Navigator', route: '-',
      childCount: 2,
    },
    {
      id: '8', name: 'T度导向', desc: '这是一段描述', type: 'menu', position: 'Navigator', route: '-',
      childCount: 2,
    },
    {
      id: '9', name: 'T度导向', desc: '这是一段描述', type: 'menu', position: 'Navigator', route: '-',
      childCount: 2,
    },
    {
      id: '10', name: 'T度导向', desc: '这是一段描述', type: 'menu', position: 'Navigator', route: '-',
      childCount: 2,
    },
  ]);

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

  onSearch(keyword: string) {
    this.searchKeyword.set(keyword);
  }

  toggleExpand(item: MenuItem) {
    item.expanded = !item.expanded;
    this.menuData.update(d => [...d]);
  }

  toggleSelect(id: string) {
    this.selectedIds.update(s => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
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
}
