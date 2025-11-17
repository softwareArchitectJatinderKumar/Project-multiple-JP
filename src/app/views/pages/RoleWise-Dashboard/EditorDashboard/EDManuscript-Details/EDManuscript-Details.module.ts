import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { EDManuscriptDetailsComponent } from './EDManuscript-Details.component';
import { MaterialModule } from 'src/material.module';


const routes: Routes = [
  {
    path: '',
    component: EDManuscriptDetailsComponent, 
  }
]

@NgModule({
    imports: [
      CommonModule,
      RouterModule.forChild(routes),
      MaterialModule,
    ],
  
  })
export class EDManuscriptDetailsModule { }

