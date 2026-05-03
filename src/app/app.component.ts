import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PRIMENG_MODULES } from './shared/primeng.imports';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PRIMENG_MODULES],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  protected readonly title = signal('angular-lab');
}
