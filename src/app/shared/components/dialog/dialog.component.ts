import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
})
export class DialogComponent {
  readonly visible = input<boolean>(false);
  readonly title = input<string>('');
  readonly width = input<string>('480px');
  readonly showClose = input<boolean>(true);

  readonly visibleChange = output<boolean>();
  readonly close = output<void>();

  onOverlayClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  onClose(): void {
    this.visibleChange.emit(false);
    this.close.emit();
  }
}
