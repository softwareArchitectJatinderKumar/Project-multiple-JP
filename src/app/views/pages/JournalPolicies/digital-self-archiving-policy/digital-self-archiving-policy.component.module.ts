import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DigitalSelfArchivingPolicyComponent} from './digital-self-archiving-policy.component';


const routes: Routes = [
  {
    path: '',
    component: DigitalSelfArchivingPolicyComponent, 
  }
]

@NgModule({
    imports: [
      CommonModule,
      RouterModule.forChild(routes),
  
    ],
  
  })
export class DigitalSelfArchivingPolicyComponentModule { }
