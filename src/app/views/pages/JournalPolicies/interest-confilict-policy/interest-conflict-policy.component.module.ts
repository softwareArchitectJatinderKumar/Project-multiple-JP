import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { InterestConfilictPolicyComponent} from './interest-confilict-policy.component';


const routes: Routes = [
  {
    path: '',
    component: InterestConfilictPolicyComponent, 
  }
]

@NgModule({
    imports: [
      CommonModule,
      RouterModule.forChild(routes),
  
    ],
  
  })
export class InterestConfilictPolicyComponentModule { }
