import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditArticlesPageRoutingModule } from './edit-articles-routing.module';

import { EditArticlesPage } from './edit-articles.page';
import { ComponentModule } from 'src/app/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditArticlesPageRoutingModule,
    ComponentModule
  ],
  declarations: [EditArticlesPage]
})
export class EditArticlesPageModule {}
