import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'splash',
    pathMatch: 'full',
  },
  {
    path: 'splash',
    loadComponent: () =>
      import('./splash/splash.page').then((m) => m.SplashPage),
  },
  // {
  //   path: 'login',
  //   loadComponent: () =>
  //     import('./login/login.page').then((m) => m.LoginPage),
  // },
  {
    path: 'home',
    loadComponent: () =>
      import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.page').then( m => m.RegisterPage)
  },
  {
    path: 'add-child',
    loadComponent: () => import('./add-child/add-child.page').then( m => m.AddChildPage)
  },
  {
    path: 'child/:index',
    loadComponent: () => import('./child-detail/child-detail.page').then( m => m.ChildDetailPage)
  },
];