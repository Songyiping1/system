import { Component, input } from '@angular/core';

export interface TableColumn {
  key: string;
  label: string;
  width?: string;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss',
})
export class DataTableComponent {
  columns = input.required<TableColumn[]>();
  data = input.required<Record<string, unknown>[]>();
  showCheckbox = input(false);
  footer = input('');
}
