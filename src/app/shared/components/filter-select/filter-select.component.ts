import { Component, input, output, signal, HostListener } from '@angular/core';

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

  open = signal(false);
  selected = signal('');

  toggle(event: MouseEvent) {
    event.stopPropagation();
    this.open.update(v => !v);
  }

  select(opt: string) {
    this.selected.set(opt);
    this.open.set(false);
    this.change.emit(opt);
  }

  displayLabel(): string {
    const sel = this.selected();
    return sel || this.label();
  }

  @HostListener('document:click')
  onDocumentClick() {
    if (this.open()) {
      this.open.set(false);
    }
  }
}
