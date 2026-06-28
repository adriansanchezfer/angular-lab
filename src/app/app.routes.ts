import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/shell/shell.component')
        .then(m => m.ShellComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'codexrxjs'
      },
      {
        path: 'codexrxjs',
        loadComponent: () =>
          import('./pages/codexrxjs/codexrxjs.component')
            .then(m => m.CodexrxjsComponent)
      },
      {
        path: 'codexsignals',
        loadComponent: () =>
          import('./pages/codexsignals/codexsignals.component')
            .then(m => m.CodexsignalsComponent)
      },
      {
        path: 'codexhttp',
        loadComponent: () =>
          import('./pages/codexhttp/codexhttp.component')
            .then(m => m.CodexhttpComponent)
      },
      {
        path: 'codexngrx',
        loadComponent: () =>
          import('./pages/codexngrx/codexngrx.component')
            .then(m => m.CodexngrxComponent)
      },
      {
        path: 'codexfrontend',
        loadComponent: () =>
          import('./pages/codexfrontend/codexfrontend.component')
            .then(m => m.CodexfrontendComponent)
      },
      {
        path: 'codexarchitecture',
        loadComponent: () =>
          import('./pages/codexarchitecture/codexarchitecture.component')
            .then(m => m.CodexarchitectureComponent)
      },
      {
        path: 'codexjest',
        loadComponent: () =>
          import('./pages/codexjest/codexjest.component')
            .then(m => m.CodexjestComponent)
      },
      {
        path: 'codextesting',
        loadComponent: () =>
          import('./pages/codexjest/codexjest.component')
            .then(m => m.CodexjestComponent)
      },
      {
        path: 'codexgit',
        loadComponent: () =>
          import('./pages/codexgit/codexgit.component')
            .then(m => m.CodexgitComponent)
      }
    ]
  }
];
