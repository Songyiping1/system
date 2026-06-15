import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastHost } from './core/feedback/toast-host';
import { ConfirmHost } from './core/feedback/confirm-host';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastHost, ConfirmHost],
  templateUrl: './app.html',
})
export class App {}
