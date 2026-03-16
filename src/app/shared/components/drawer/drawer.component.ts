import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-drawer',
  templateUrl: './drawer.component.html',
  styleUrl: './drawer.component.scss',
})
export class DrawerComponent {
  readonly visible = input<boolean>(false);
  readonly title = input.required<string>();
  readonly width = input<string>('700px');

  readonly visibleChange = output<boolean>();
  readonly closed = output<void>();

  close(): void {
    this.visibleChange.emit(false);
    this.closed.emit();
  }
}
