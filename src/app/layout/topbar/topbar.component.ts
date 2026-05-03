import { Component } from '@angular/core';
import { PRIMENG_MODULES } from '../../shared/primeng.imports';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-topbar',
  imports: [PRIMENG_MODULES],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss',
})
export class TopbarComponent {
   items: MenuItem[] = [
    {
      label: 'Componentes',
      icon: 'pi pi-th-large',
      routerLink: '/',
      routerLinkActiveOptions: { exact: true }
    },
    {
      label: 'Laboratorio',
      icon: 'pi pi-code',
      routerLink: '/lab',
      routerLinkActiveOptions: { exact: true }
    }
  ];
}
