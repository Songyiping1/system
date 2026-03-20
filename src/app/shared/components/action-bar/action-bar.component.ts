import { Component } from '@angular/core';

@Component({
  selector: 'app-action-bar',
  standalone: true,
  template: '<div class="action-bar"><div class="action-left"><ng-content select="[left]" /></div><div class="action-right"><ng-content select="[right]" /></div></div>',
  styleUrl: './action-bar.component.scss',
})
export class ActionBarComponent {}
