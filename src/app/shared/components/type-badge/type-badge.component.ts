import { Component, input } from '@angular/core';

@Component({
  selector: 'app-type-badge',
  standalone: true,
  template: '<span class="type-badge">{{ label() }}</span>',
  styleUrl: './type-badge.component.scss',
})
export class TypeBadgeComponent {
  label = input.required<string>();
}
