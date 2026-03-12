import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss',
})
export class AvatarComponent {
  readonly src = input<string | undefined>(undefined);
  readonly name = input<string>('');
  readonly size = input<number>(32);
  readonly online = input<boolean>(false);

  readonly firstChar = computed(() => {
    const text = this.name();
    return text ? text.charAt(0).toUpperCase() : '';
  });

  readonly bgColor = computed(() => {
    const name = this.name();
    if (!name) return '#999';
    const colors = ['#2e67f4', '#f59e0b', '#12b76a', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#f97316'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  });
}
