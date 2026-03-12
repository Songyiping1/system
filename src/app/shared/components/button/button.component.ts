import { Component, input, output } from '@angular/core';
import { ButtonVariant, ButtonSize } from '../../models';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  readonly label = input<string>('');
  readonly variant = input<ButtonVariant>('primary');
  readonly size = input<ButtonSize>('md');
  readonly icon = input<string | undefined>(undefined);
  readonly disabled = input<boolean>(false);
  readonly fullWidth = input<boolean>(false);
  readonly loading = input<boolean>(false);

  readonly clicked = output<void>();

  onClick(): void {
    if (!this.disabled() && !this.loading()) {
      this.clicked.emit();
    }
  }
}
