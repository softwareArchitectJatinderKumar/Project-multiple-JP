import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';   
import { ChangePasswordComponent } from './Change-Password.component';
import { MaterialModule } from 'src/material.module';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule, NgForm } from '@angular/forms';
const routes: Routes = [
  {
    path: '',
    component: ChangePasswordComponent, 
  }
]

@NgModule({
    imports: [
      CommonModule,
      RouterModule.forChild(routes),
      ReactiveFormsModule
    ],
  
  })
export class ChangePasswordComponentModule { }

