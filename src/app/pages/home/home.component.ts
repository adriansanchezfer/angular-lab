import { Component } from '@angular/core';
import { PRIMENG_MODULES } from '../../shared/primeng.imports';

@Component({
  selector: 'app-components-home',
  imports: [PRIMENG_MODULES],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
