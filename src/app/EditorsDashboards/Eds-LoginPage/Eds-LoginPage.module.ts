import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { EdsLoginPageComponent } from './Eds-LoginPage.component';

const routes: Routes = [
  {
    path: '',
    component: EdsLoginPageComponent, 
  }
]

@NgModule({
    imports: [
      CommonModule,
      RouterModule.forChild(routes),
      
  
    ],
  
  })
 
export class EdsLoginModule { }
