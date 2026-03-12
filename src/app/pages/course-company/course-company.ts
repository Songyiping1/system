import { Component, signal, computed } from '@angular/core';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { ActionBarComponent } from '../../shared/components/action-bar/action-bar.component';
import { SearchInputComponent } from '../../shared/components/search-input/search-input.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { CheckboxComponent } from '../../shared/components/checkbox/checkbox.component';
import { CompanyIconComponent } from '../../shared/components/company-icon/company-icon.component';

@Component({
  selector: 'app-course-company',
  imports: [PageHeaderComponent, ActionBarComponent, SearchInputComponent, ButtonComponent, CheckboxComponent, CompanyIconComponent],
  templateUrl: './course-company.html',
  styleUrl: './course-company.scss',
})
export class CourseCompany {
  readonly searchValue = signal('');
  readonly selectedKeys = signal<string[]>([]);
  readonly expandedKeys = signal<string[]>(['1']);

  readonly rows = signal([
    { key: '1', name: '商道课', iconText: '商道', shortName: '商道', count: 79, phone: '15147888855' },
    { key: '2', name: '全员协同课程', iconText: '全员', shortName: '商道', count: 12, phone: '15147888855' },
    { key: '3', name: '家道课', iconText: '家道', shortName: '商道', count: 31, phone: '15147888855' },
  ]);

  readonly selectAll = computed(() => {
    const keys = this.selectedKeys();
    return keys.length > 0 && keys.length === this.rows().length;
  });

  readonly indeterminate = computed(() => {
    const keys = this.selectedKeys();
    return keys.length > 0 && keys.length < this.rows().length;
  });

  toggleSelectAll(): void {
    if (this.selectAll()) {
      this.selectedKeys.set([]);
    } else {
      this.selectedKeys.set(this.rows().map(r => r.key));
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
}
