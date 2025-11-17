import { SecurePasswordChangeComponent } from './SecurePasswordChange.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import {  FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from "@angular/material/select";


const routes: Routes = [
  {
    path: '',
    component: SecurePasswordChangeComponent, 
  }
]
@NgModule({
  declarations: [SecurePasswordChangeComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,        
    
],
})
export class SecurePasswordChangeComponentModule { }
