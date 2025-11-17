import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { CorectionRetractionPolicyComponent} from './corection-retraction-policy.component';


const routes: Routes = [
  {
    path: '',
    component: CorectionRetractionPolicyComponent, 
  }
]

@NgModule({
    imports: [
      CommonModule,
      RouterModule.forChild(routes),
  
    ],
  
  })
export class CorectionRetractionPolicyComponentModule { }
