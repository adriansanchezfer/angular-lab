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
      label: 'Codex RxJS',
      icon: 'pi pi-bolt',
      routerLink: '/codexrxjs',
      routerLinkActiveOptions: { exact: true }
    },
    {
      label: 'Signals',
      icon: 'pi pi-sparkles',
      routerLink: '/codexsignals',
      routerLinkActiveOptions: { exact: true }
    },
    {
      label: 'HTTP',
      icon: 'pi pi-cloud-download',
      routerLink: '/codexhttp',
      routerLinkActiveOptions: { exact: true }
    },
    {
      label: 'NgRx',
      icon: 'pi pi-sitemap',
      routerLink: '/codexngrx',
      routerLinkActiveOptions: { exact: true }
    },
    {
      label: 'Frontend',
      icon: 'pi pi-desktop',
      routerLink: '/codexfrontend',
      routerLinkActiveOptions: { exact: true }
    },
    {
      label: 'Arquitectura',
      icon: 'pi pi-sitemap',
      routerLink: '/codexarchitecture',
      routerLinkActiveOptions: { exact: true }
    },
    {
      label: 'Testing',
      icon: 'pi pi-check-circle',
      routerLink: '/codextesting',
      routerLinkActiveOptions: { exact: true }
    },
    {
      label: 'Git',
      icon: 'pi pi-code',
      routerLink: '/codexgit',
      routerLinkActiveOptions: { exact: true }
    }
  ];
}
