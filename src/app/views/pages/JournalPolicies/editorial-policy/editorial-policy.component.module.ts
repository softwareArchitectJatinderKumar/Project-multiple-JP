import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { EditorialPolicyComponent} from './editorial-policy.component';


const routes: Routes = [
  {
    path: '',
    component: EditorialPolicyComponent, 
  }
]

@NgModule({
    imports: [
      CommonModule,
      RouterModule.forChild(routes),
  
    ],
  
  })
export class EditorialPolicyComponentModule { }
