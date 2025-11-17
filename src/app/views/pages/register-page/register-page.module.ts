import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { RegisterPageComponent } from './register-page.component';
import { FormsModule, NgForm } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: RegisterPageComponent, 
  }
]

@NgModule({
    imports: [
      CommonModule,
      RouterModule.forChild(routes),
      FormsModule,
      ReactiveFormsModule,
      
  
    ],
  
  })
 
export class RegisterPageComponentModule { }





// export class PublicationChargePolicyComponentModule { }
