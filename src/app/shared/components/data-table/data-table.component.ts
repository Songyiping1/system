import { Component, input, output } from '@angular/core';
import { ColumnDef } from '../../models';
import { CheckboxComponent } from '../checkbox/checkbox.component';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss',
  imports: [CheckboxComponent],
})
export class DataTableComponent {
  readonly columns = input<ColumnDef[]>([]);
  readonly rows = input<any[][]>([]);
  readonly selectable = input<boolean>(false);
  readonly selectedKeys = input<string[]>([]);
  readonly selectAll = input<boolean>(false);

  readonly selectedKeysChange = output<string[]>();
  readonly selectAllChange = output<boolean>();
  readonly rowClick = output<any>();
  readonly sort = output<string>();

  onSelectAll(checked: boolean): void {
    this.selectAllChange.emit(checked);
  }

  onSort(key: string): void {
    this.sort.emit(key);
  }
}
