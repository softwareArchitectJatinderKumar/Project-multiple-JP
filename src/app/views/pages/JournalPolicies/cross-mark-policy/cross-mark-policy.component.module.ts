import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { CrossMarkPolicyComponent} from './cross-mark-policy.component';


const routes: Routes = [
  {
    path: '',
    component: CrossMarkPolicyComponent, 
  }
]

@NgModule({
    imports: [
      CommonModule,
      RouterModule.forChild(routes),
  
    ],
  
  })
export class CrossMarkPolicyComponentModule { }
