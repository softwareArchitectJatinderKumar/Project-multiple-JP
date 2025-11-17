import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LoginWithRolesComponent } from './LoginWithRoles.component';
import { FormsModule, NgForm } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: LoginWithRolesComponent, 
  }
]

@NgModule({
    imports: [
      CommonModule,
      RouterModule.forChild(routes),   
  
    ],
  
  })
 
export class LoginWithRolesModule { }
