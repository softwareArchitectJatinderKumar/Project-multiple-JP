import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ReviewersHeaderComponent } from './ReviewersHeader.component';


const routes: Routes = [
  {
    path: '',
    component: ReviewersHeaderComponent, 
  }
]

@NgModule({
    imports: [
      CommonModule,
      RouterModule.forChild(routes),
  
    ],
  
  })
export class ReviewersHeaderModule { }