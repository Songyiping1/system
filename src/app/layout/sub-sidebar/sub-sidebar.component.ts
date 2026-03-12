import { Component, input, output } from '@angular/core';
import { MenuGroup } from '../../shared/models';

@Component({
  selector: 'app-sub-sidebar',
  templateUrl: './sub-sidebar.component.html',
  styleUrl: './sub-sidebar.component.scss',
})
export class SubSidebarComponent {
  readonly groups = input.required<MenuGroup[]>();
  readonly activeKey = input.required<string>();
  readonly activeKeyChange = output<string>();
}
