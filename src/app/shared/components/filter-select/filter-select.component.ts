import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-filter-select',
  standalone: true,
  templateUrl: './filter-select.component.html',
  styleUrl: './filter-select.component.scss',
})
export class FilterSelectComponent {
  label = input.required<string>();
  options = input<string[]>([]);
  change = output<string>();
}
