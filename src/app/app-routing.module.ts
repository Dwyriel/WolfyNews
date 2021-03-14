import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./pags/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'account',
    loadChildren: () => import('./pags/user-form/user-form.module').then( m => m.UserFormPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pags/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'admin_users',
    loadChildren: () => import('./pags/admin-users/admin-users.module').then( m => m.AdminUsersPageModule)
  },
  {
    path: '**',
    loadChildren: () => import('./pags/error-page/error-page.module').then( m => m.ErrorPagePageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
