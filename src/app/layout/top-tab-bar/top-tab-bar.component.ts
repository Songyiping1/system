import { Component, input, output, signal, HostListener } from '@angular/core';
import { Tab } from '../../shared/models';
import { AvatarComponent } from '../../shared/components/avatar/avatar.component';

@Component({
  selector: 'app-top-tab-bar',
  templateUrl: './top-tab-bar.component.html',
  styleUrl: './top-tab-bar.component.scss',
  imports: [AvatarComponent],
})
export class TopTabBarComponent {
  readonly tabs = input.required<Tab[]>();
  readonly activeKey = input.required<string>();
  readonly notificationCount = input<number>(0);
  readonly activeKeyChange = output<string>();
  readonly tabClose = output<string>();
  readonly menuAction = output<string>();

  readonly showDropdown = signal(false);

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.top-tab-bar__avatar-wrap')) {
      this.showDropdown.set(false);
    }
  }

  toggleDropdown(event: MouseEvent): void {
    event.stopPropagation();
    this.showDropdown.update(v => !v);
  }

  onClose(event: MouseEvent, key: string): void {
    event.stopPropagation();
    this.tabClose.emit(key);
  }

  onMenuClick(action: string): void {
    this.showDropdown.set(false);
    this.menuAction.emit(action);
  }
}
