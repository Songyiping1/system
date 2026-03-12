import { Component, input } from '@angular/core';

@Component({
  selector: 'app-child-count-badge',
  templateUrl: './child-count-badge.component.html',
  styleUrl: './child-count-badge.component.scss',
})
export class ChildCountBadgeComponent {
  readonly count = input.required<number>();
}
