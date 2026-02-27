import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { EdsTopMenuBarComponent } from './Eds-TopMenuBar.component';


const routes: Routes = [
  {
    path: '',
    component: EdsTopMenuBarComponent, 
  }
]

@NgModule({
    imports: [
      CommonModule,
      RouterModule.forChild(routes),
  
    ],
  
  })
export class EdsTopMenuBarModule { }