import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ArticlesPageRoutingModule } from './articles-routing.module';

import { ArticlesPage } from './articles.page';
import { ComponentModule } from 'src/app/components/component.module';
import { ResumePipe } from 'src/app/pipes/resume.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ArticlesPageRoutingModule,
    ComponentModule
  ],
  declarations: [ArticlesPage, ResumePipe]
})
export class ArticlesPageModule {}
