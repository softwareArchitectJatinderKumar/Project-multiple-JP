import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { EditorHeaderComponent } from './EditorHeader.component';


const routes: Routes = [
  {
    path: '',
    component: EditorHeaderComponent, 
  }
]

@NgModule({
    imports: [
      CommonModule,
      RouterModule.forChild(routes),
  
    ],
  
  })
export class EditorHeaderModule { }