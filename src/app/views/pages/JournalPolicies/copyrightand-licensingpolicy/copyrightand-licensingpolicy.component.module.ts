import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { CopyrightandLicensingpolicyComponent } from './copyrightand-licensingpolicy.component';


const routes: Routes = [
  {
    path: '',
    component: CopyrightandLicensingpolicyComponent, 
  }
]

@NgModule({
    imports: [
      CommonModule,
      RouterModule.forChild(routes),
  
    ],
  
  })
export class CopyrightandLicensingpolicyComponentModule { }
