import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { PublicationChargePolicyComponent} from './publication-charge-policy.component';


const routes: Routes = [
  {
    path: '',
    component: PublicationChargePolicyComponent, 
  }
]

@NgModule({
    imports: [
      CommonModule,
      RouterModule.forChild(routes),
  
    ],
  
  })
export class PublicationChargePolicyComponentModule { }
