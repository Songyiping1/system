import { Component, input, output } from '@angular/core';
import { FilterOption } from '../../models';

@Component({
  selector: 'app-status-filter',
  templateUrl: './status-filter.component.html',
  styleUrl: './status-filter.component.scss',
})
export class StatusFilterComponent {
  readonly label = input<string>('');
  readonly options = input<FilterOption[]>([]);
  readonly value = input<string>('');

  readonly valueChange = output<string>();

  onChange(event: Event): void {
    const val = (event.target as HTMLSelectElement).value;
    this.valueChange.emit(val);
  }
}
