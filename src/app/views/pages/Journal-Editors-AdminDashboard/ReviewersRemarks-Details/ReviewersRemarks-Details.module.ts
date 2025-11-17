import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ReviewersRemarksDetailsComponent } from './ReviewersRemarks-Details.component';
import { MaterialModule } from 'src/material.module';


const routes: Routes = [
  {
    path: '',
    component: ReviewersRemarksDetailsComponent, 
  }
]

@NgModule({
    imports: [
      CommonModule,
      RouterModule.forChild(routes),
      MaterialModule,
    ],
  
  })
export class ReviewersRemarksDetailsModule { }

