import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AllUserDetailsComponent } from './All-User-Details.component';
import { MaterialModule } from 'src/material.module';


const routes: Routes = [
  {
    path: '',
    component: AllUserDetailsComponent, 
  }
]

@NgModule({
    imports: [
      CommonModule,
      RouterModule.forChild(routes),
      MaterialModule,
    ],
  
  })
export class AllUserDetailsModule { }

