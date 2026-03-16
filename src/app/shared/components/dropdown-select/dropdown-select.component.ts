import { Component, input, output, signal, HostListener, ElementRef, inject } from '@angular/core';

export interface DropdownOption {
  label: string;
  value: string;
  level?: number;
  badge?: string;
  children?: DropdownOption[];
}

@Component({
  selector: 'app-dropdown-select',
  templateUrl: './dropdown-select.component.html',
  styleUrl: './dropdown-select.component.scss',
})
export class DropdownSelectComponent {
  readonly options = input.required<DropdownOption[]>();
  readonly value = input<string>('');
  readonly placeholder = input<string>('请选择');
  readonly valueChange = output<string>();

  readonly isOpen = signal(false);
  private readonly el = inject(ElementRef);

  get displayLabel(): string {
    const found = this.findOption(this.options(), this.value());
    return found ? found.label : this.placeholder();
  }

  toggle(event: MouseEvent): void {
    event.stopPropagation();
    this.isOpen.update(v => !v);
  }

  select(option: DropdownOption, event: MouseEvent): void {
    event.stopPropagation();
    this.valueChange.emit(option.value);
    this.isOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.el.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }

  flattenOptions(): { option: DropdownOption; level: number }[] {
    const result: { option: DropdownOption; level: number }[] = [];
    const flatten = (opts: DropdownOption[], level: number) => {
      for (const opt of opts) {
        result.push({ option: opt, level: opt.level ?? level });
        if (opt.children?.length) {
          flatten(opt.children, level + 1);
        }
      }
    };
    flatten(this.options(), 0);
    return result;
  }

  private findOption(options: DropdownOption[], value: string): DropdownOption | null {
    for (const opt of options) {
      if (opt.value === value) return opt;
      if (opt.children?.length) {
        const found = this.findOption(opt.children, value);
        if (found) return found;
      }
    }
    return null;
  }
}
