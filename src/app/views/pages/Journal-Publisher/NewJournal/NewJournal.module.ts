
import { JournalFormComponent } from './NewJournal.component';
 

import { ReactiveFormsModule } from '@angular/forms';
import {} from './NewJournal.component'
import { BrowserModule } from '@angular/platform-browser';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule } from 'src/material.module';


const routes: Routes = [
  {
    path: '',
    component: JournalFormComponent, 
  }
]

@NgModule({
    imports: [
      CommonModule,
      RouterModule.forChild(routes),
      MaterialModule,MatDialogModule,MatPaginatorModule,ReactiveFormsModule
    ],
  
  })
export class JournalFormComponentModule { }












































// Added by Jatinder Kumar 31309