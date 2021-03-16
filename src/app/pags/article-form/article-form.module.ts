import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ArticleFormPageRoutingModule } from './article-form-routing.module';

import { ArticleFormPage } from './article-form.page';
import { ComponentModule } from 'src/app/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ArticleFormPageRoutingModule,
    ComponentModule
  ],
  declarations: [ArticleFormPage]
})
export class ArticleFormPageModule {}
