import { Component, input } from '@angular/core';
import { BadgeVariant } from '../../models';

@Component({
  selector: 'app-type-badge',
  templateUrl: './type-badge.component.html',
  styleUrl: './type-badge.component.scss',
})
export class TypeBadgeComponent {
  readonly label = input.required<string>();
  readonly variant = input<BadgeVariant>('primary');
}
