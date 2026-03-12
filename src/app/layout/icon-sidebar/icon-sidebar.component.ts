import { Component, input, output } from '@angular/core';
import { NavItem } from '../../shared/models';

@Component({
  selector: 'app-icon-sidebar',
  templateUrl: './icon-sidebar.component.html',
  styleUrl: './icon-sidebar.component.scss',
})
export class IconSidebarComponent {
  readonly items = input.required<NavItem[]>();
  readonly activeKey = input.required<string>();
  readonly activeKeyChange = output<string>();

  private readonly icons: Record<string, string> = {
    control: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5"/></svg>`,
    support: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M3 18v-6a9 9 0 0 1 18 0v6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3v5ZM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3v5Z" stroke="currentColor" stroke-width="1.5"/></svg>`,
  };

  getIcon(iconKey: string): string {
    return this.icons[iconKey] ?? '';
  }
}
