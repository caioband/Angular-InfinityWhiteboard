import { Routes } from '@angular/router';


import { DashboardComponent } from './pages/dashboard/dashboard';

import { LoginComponent } from './pages/login/login'

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  {
    path: '',
    component: LoginComponent,
    children: [
      { path: 'login', component: LoginComponent }
    ]
  }
];
