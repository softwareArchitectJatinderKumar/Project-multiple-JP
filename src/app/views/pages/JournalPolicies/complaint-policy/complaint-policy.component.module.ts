import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ComplaintPolicyComponent } from './complaint-policy.component';


const routes: Routes = [
  {
    path: '',
    component: ComplaintPolicyComponent, 
  }
]

@NgModule({
    imports: [
      CommonModule,
      RouterModule.forChild(routes),
  
    ],
  
  })
export class ComplaintPolicyComponentModule { }
