import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { PlagriasmPolicyComponent} from './plagriasm-policy.component';


const routes: Routes = [
  {
    path: '',
    component: PlagriasmPolicyComponent, 
  }
]

@NgModule({
    imports: [
      CommonModule,
      RouterModule.forChild(routes),
  
    ],
  
  })
export class PlagriasmPolicyComponentModule { }
