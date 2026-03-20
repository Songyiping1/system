import { Component, input } from '@angular/core';

@Component({
  selector: 'app-split-layout',
  standalone: true,
  templateUrl: './split-layout.component.html',
  styleUrl: './split-layout.component.scss',
})
export class SplitLayoutComponent {
  leftWidth = input(280);
}
