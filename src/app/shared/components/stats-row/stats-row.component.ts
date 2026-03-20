import { Component, input, output } from '@angular/core';

export interface StatItem {
  label: string;
  value: string | number;
}

@Component({
  selector: 'app-stats-row',
  standalone: true,
  templateUrl: './stats-row.component.html',
  styleUrl: './stats-row.component.scss',
})
export class StatsRowComponent {
  items = input.required<StatItem[]>();
  itemClick = output<StatItem>();
}
