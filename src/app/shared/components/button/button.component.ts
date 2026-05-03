import { Component } from '@angular/core';
import { PRIMENG_MODULES } from '../../primeng.imports';

@Component({
  selector: 'app-button',
  imports: [PRIMENG_MODULES],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {}
