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
    path: 'articles',
    loadChildren: () => import('./pags/articles/articles.module').then( m => m.ArticlesPageModule)
  },
  {
    path: 'article/:id',
    loadChildren: () => import('./pags/article/article.module').then( m => m.ArticlePageModule)
  },
  {
    path: 'about',
    loadChildren: () => import('./pags/about/about.module').then( m => m.AboutPageModule)
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
    path: 'profile',
    loadChildren: () => import('./pags/profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'profile/:id',
    loadChildren: () => import('./pags/profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'article-form',
    loadChildren: () => import('./pags/article-form/article-form.module').then( m => m.ArticleFormPageModule)
  },
  {
    path: 'article-form/:id',
    loadChildren: () => import('./pags/article-form/article-form.module').then( m => m.ArticleFormPageModule)
  },
  {
    path: 'edit_articles',
    loadChildren: () => import('./pags/edit-articles/edit-articles.module').then( m => m.EditArticlesPageModule)
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
