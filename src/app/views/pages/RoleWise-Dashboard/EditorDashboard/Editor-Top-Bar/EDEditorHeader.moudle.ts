import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { EDEditorHeaderComponent } from './EDEditorHeader.component';


const routes: Routes = [
  {
    path: '',
    component: EDEditorHeaderComponent, 
  }
]

@NgModule({
    imports: [
      CommonModule,
      RouterModule.forChild(routes),
  
    ],
  
  })
export class EDEditorHeaderModule { }