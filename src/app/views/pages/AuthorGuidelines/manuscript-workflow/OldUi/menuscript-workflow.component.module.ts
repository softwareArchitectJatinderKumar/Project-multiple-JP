import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ManuScriptWorkflowComponent} from './ManuScript-workflow.component';


const routes: Routes = [
  {
    path: '',
    component: ManuScriptWorkflowComponent, 
  }
]

@NgModule({
    imports: [
      CommonModule,
      RouterModule.forChild(routes),
  
    ],
  
  })
export class ManuScriptWorkflowComponentModule { }
