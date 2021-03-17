import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditArticlesPage } from './edit-articles.page';

const routes: Routes = [
  {
    path: '',
    component: EditArticlesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditArticlesPageRoutingModule {}
