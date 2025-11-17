import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SubmitManuScriptComponent } from './submitManuScript.component';

import { FormsModule, NgForm } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { MaterialModule } from 'src/material.module';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

const routes: Routes = [
  {
    path: '',
    component: SubmitManuScriptComponent, 
  }
]

@NgModule({
  
    imports: [
      CommonModule,
      RouterModule.forChild(routes),     
      MatPaginatorModule,
      FormsModule,
      MaterialModule,
      MatDialogModule,
      ReactiveFormsModule, 
      MatSelectModule,
      MatFormFieldModule,
      MatInputModule
      // MatSelectModule and MatFormFieldModule      
    ],
  
  })
 
export class submitManuScriptComponentModule { }
