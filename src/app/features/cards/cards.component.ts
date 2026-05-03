import { Component } from '@angular/core';
import { PRIMENG_MODULES } from '../../shared/primeng.imports';

@Component({
  selector: 'app-cards',
  imports: [PRIMENG_MODULES],
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.scss',
})
export class CardsComponent {}
