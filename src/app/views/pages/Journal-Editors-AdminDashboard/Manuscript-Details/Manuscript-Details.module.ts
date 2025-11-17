import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ManuscriptDetailsComponent } from './Manuscript-Details.component';
import { MaterialModule } from 'src/material.module';


const routes: Routes = [
  {
    path: '',
    component: ManuscriptDetailsComponent, 
  }
]

@NgModule({
    imports: [
      CommonModule,
      RouterModule.forChild(routes),
      MaterialModule,
    ],
  
  })
export class ManuscriptDetailsModule { }

