import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ManuScriptPreparationComponent } from './ManuScript-preparation.component';


const routes: Routes = [
  {
    path: '',
    component: ManuScriptPreparationComponent, 
  }
]

@NgModule({
    imports: [
      CommonModule,
      RouterModule.forChild(routes),
  
    ],
  
  })
export class ManuScriptPreparationComponentModule { }
