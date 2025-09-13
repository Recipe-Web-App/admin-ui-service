import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/hello-world.component').then((m) => m.HelloWorldComponent),
  },
];
