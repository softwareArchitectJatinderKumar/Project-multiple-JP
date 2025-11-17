import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { PeerReviewPolicyComponent} from './peer-review-policy.component';


const routes: Routes = [
  {
    path: '',
    component: PeerReviewPolicyComponent, 
  }
]

@NgModule({
    imports: [
      CommonModule,
      RouterModule.forChild(routes),
  
    ],
  
  })
export class PeerReviewPolicyComponentModule { }
