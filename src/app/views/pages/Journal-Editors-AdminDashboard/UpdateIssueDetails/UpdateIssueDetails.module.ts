import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpdateIssueDetailsComponent } from './UpdateIssueDetails.component';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';   
import { MaterialModule } from 'src/material.module';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule, NgForm } from '@angular/forms';
const routes: Routes = [
  {
    path: '',
    component: UpdateIssueDetailsComponent, 
  }
]

@NgModule({
    imports: [
      CommonModule,
      RouterModule.forChild(routes),
      ReactiveFormsModule,
      MaterialModule,
      FormsModule
    ],
  
  })

export class UpdateIssueDetailsModule { }



