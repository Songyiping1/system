import { Component, input, output } from '@angular/core';
import { StatsCard } from '../../models';

@Component({
  selector: 'app-stats-card-row',
  templateUrl: './stats-card-row.component.html',
  styleUrl: './stats-card-row.component.scss',
})
export class StatsCardRowComponent {
  readonly cards = input.required<StatsCard[]>();

  readonly cardClick = output<StatsCard>();

  onCardClick(card: StatsCard): void {
    if (card.clickable) {
      this.cardClick.emit(card);
    }
  }
}
