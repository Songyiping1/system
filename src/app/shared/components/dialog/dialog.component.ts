import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
})
export class DialogComponent {
  readonly visible = input<boolean>(false);
  readonly title = input.required<string>();
  readonly description = input<string>('');
  readonly width = input<string>('480px');
  readonly showClose = input<boolean>(true);
  readonly showBack = input<boolean>(false);
  readonly headerBorder = input<boolean>(true);
  readonly footerBorder = input<boolean>(false);

  readonly visibleChange = output<boolean>();
  readonly closed = output<void>();
  readonly back = output<void>();

  onOverlayClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  onClose(): void {
    this.visibleChange.emit(false);
    this.closed.emit();
  }

  onBack(): void {
    this.back.emit();
  }
}
