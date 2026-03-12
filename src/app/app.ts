import { Component } from '@angular/core';
import { AppLayoutComponent } from './layout/app-layout/app-layout.component';

@Component({
  selector: 'app-root',
  imports: [AppLayoutComponent],
  template: '<app-layout />',
})
export class App {}
