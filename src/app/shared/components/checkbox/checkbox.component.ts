import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss',
})
export class CheckboxComponent {
  readonly checked = input<boolean>(false);
  readonly indeterminate = input<boolean>(false);
  readonly disabled = input<boolean>(false);

  readonly checkedChange = output<boolean>();

  toggle(): void {
    if (!this.disabled()) {
      this.checkedChange.emit(!this.checked());
    }
  }
}
