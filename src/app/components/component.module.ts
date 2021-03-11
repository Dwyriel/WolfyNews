import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from './header/header.component';

@NgModule({
    declarations: [HeaderComponent],
    exports: [HeaderComponent],
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        RouterModule,
    ]
})
export class ComponentModule { }