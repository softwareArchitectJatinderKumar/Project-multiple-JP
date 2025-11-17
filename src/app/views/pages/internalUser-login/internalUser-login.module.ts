import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { InternalUserLoginComponent } from './internalUser-login.component';

const routes: Routes = [
  {
    path: '',
    component: InternalUserLoginComponent, 
  }
]

@NgModule({
    imports: [
      CommonModule,
      RouterModule.forChild(routes),
      
  
    ],
  
  })
 
export class InternalUserLoginModule { }
