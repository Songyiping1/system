import { Component, input, output, signal, computed } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PersonTreeNode } from '../../models';
import { SearchInputComponent } from '../search-input/search-input.component';
import { CompanyIconComponent } from '../company-icon/company-icon.component';
import { AvatarComponent } from '../avatar/avatar.component';

@Component({
  selector: 'app-person-tree',
  templateUrl: './person-tree.component.html',
  styleUrl: './person-tree.component.scss',
  imports: [NgTemplateOutlet, FormsModule, SearchInputComponent, CompanyIconComponent, AvatarComponent],
})
export class PersonTreeComponent {
  readonly nodes = input.required<PersonTreeNode[]>();
  readonly selectedKeys = input<string[]>([]);
  readonly maxSelect = input<number>(1);

  readonly selectionChange = output<string[]>();

  readonly searchValue = signal('');
  readonly expandedKeys = signal<string[]>([]);

  readonly selectedCount = computed(() => this.selectedKeys().length);

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

  isSelected(key: string): boolean {
    return this.selectedKeys().includes(key);
  }

  toggleSelect(key: string): void {
    const current = this.selectedKeys();
    if (current.includes(key)) {
      this.selectionChange.emit(current.filter(k => k !== key));
    } else {
      if (this.maxSelect() === 1) {
        this.selectionChange.emit([key]);
      } else if (current.length < this.maxSelect()) {
        this.selectionChange.emit([...current, key]);
      }
    }
  }

  onSearch(value: string): void {
    this.searchValue.set(value);
  }
}
