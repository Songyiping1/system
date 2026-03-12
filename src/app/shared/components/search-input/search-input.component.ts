import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.scss',
  imports: [FormsModule],
})
export class SearchInputComponent {
  readonly placeholder = input<string>('搜索');
  readonly value = input<string>('');

  readonly valueChange = output<string>();
  readonly search = output<string>();

  onInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.valueChange.emit(val);
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.search.emit((event.target as HTMLInputElement).value);
    }
  }
}
