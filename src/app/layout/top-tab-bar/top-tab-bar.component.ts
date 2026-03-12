import { Component, input, output } from '@angular/core';
import { Tab } from '../../shared/models';

@Component({
  selector: 'app-top-tab-bar',
  templateUrl: './top-tab-bar.component.html',
  styleUrl: './top-tab-bar.component.scss',
})
export class TopTabBarComponent {
  readonly tabs = input.required<Tab[]>();
  readonly activeKey = input.required<string>();
  readonly notificationCount = input<number>(0);
  readonly activeKeyChange = output<string>();
  readonly tabClose = output<string>();

  onClose(event: MouseEvent, key: string): void {
    event.stopPropagation();
    this.tabClose.emit(key);
  }
}
