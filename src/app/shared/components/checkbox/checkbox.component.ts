import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-checkbox',
  standalone: true,
  template: '<input type="checkbox" class="checkbox" [checked]="checked()" (change)="toggle()" />',
  styleUrl: './checkbox.component.scss',
})
export class CheckboxComponent {
  checked = input(false);
  change = output<boolean>();

  toggle() {
    this.change.emit(!this.checked());
  }
}
