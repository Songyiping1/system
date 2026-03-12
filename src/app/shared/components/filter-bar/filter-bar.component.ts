import { Component, input, output, signal } from '@angular/core';
import { FilterItem } from '../../models';

@Component({
  selector: 'app-filter-bar',
  templateUrl: './filter-bar.component.html',
  styleUrl: './filter-bar.component.scss',
})
export class FilterBarComponent {
  readonly filters = input.required<FilterItem[]>();

  readonly filterChange = output<{ key: string; value: string }>();

  readonly openDropdownKey = signal<string | null>(null);

  toggleDropdown(key: string): void {
    if (this.openDropdownKey() === key) {
      this.openDropdownKey.set(null);
    } else {
      this.openDropdownKey.set(key);
    }
  }

  selectOption(filter: FilterItem, value: string): void {
    this.filterChange.emit({ key: filter.key, value });
    this.openDropdownKey.set(null);
  }

  onInputChange(filter: FilterItem, event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.filterChange.emit({ key: filter.key, value: val });
  }
}
