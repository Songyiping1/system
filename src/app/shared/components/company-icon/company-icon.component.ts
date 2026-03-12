import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'app-company-icon',
  templateUrl: './company-icon.component.html',
  styleUrl: './company-icon.component.scss',
})
export class CompanyIconComponent {
  readonly src = input<string | undefined>(undefined);
  readonly fallbackText = input<string>('');
  readonly size = input<number>(24);
  readonly bgColor = input<string>('#2e67f4');

  readonly firstChar = computed(() => {
    const text = this.fallbackText();
    return text ? text.charAt(0) : '';
  });
}
