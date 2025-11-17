import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ForgotPasswordComponent } from './ForgotPassword.component';

const routes: Routes = [
  {
    path: '',
    component: ForgotPasswordComponent, 
  }
]

@NgModule({
    imports: [
      CommonModule,
      RouterModule.forChild(routes),
      
  
    ],
  
  })
 
export class ForgotPasswordModule { }
