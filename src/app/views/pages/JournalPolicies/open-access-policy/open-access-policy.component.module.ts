import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { OpenAccessPolicyComponent} from './open-access-policy.component';


const routes: Routes = [
  {
    path: '',
    component: OpenAccessPolicyComponent, 
  }
]

@NgModule({
    imports: [
      CommonModule,
      RouterModule.forChild(routes),
  
    ],
  
  })
export class OpenAccessPolicyComponentModule { }
