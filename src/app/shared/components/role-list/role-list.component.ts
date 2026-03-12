import { Component, input, output, signal } from '@angular/core';
import { RoleGroup, RoleItem } from '../../models';
import { SearchInputComponent } from '../search-input/search-input.component';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrl: './role-list.component.scss',
  imports: [SearchInputComponent],
})
export class RoleListComponent {
  readonly groups = input.required<RoleGroup[]>();
  readonly selectedKeys = input<string[]>([]);
  readonly multiSelect = input<boolean>(true);

  readonly selectionChange = output<string[]>();

  readonly searchValue = signal('');

  isGroupExpanded(group: RoleGroup): boolean {
    return group.expanded !== false;
  }

  toggleGroup(group: RoleGroup): void {
    group.expanded = !this.isGroupExpanded(group);
  }

  isSelected(key: string): boolean {
    return this.selectedKeys().includes(key);
  }

  toggleSelect(role: RoleItem): void {
    const current = this.selectedKeys();
    if (current.includes(role.key)) {
      this.selectionChange.emit(current.filter(k => k !== role.key));
    } else {
      if (this.multiSelect()) {
        this.selectionChange.emit([...current, role.key]);
      } else {
        this.selectionChange.emit([role.key]);
      }
    }
  }

  onSearch(value: string): void {
    this.searchValue.set(value);
  }
}
