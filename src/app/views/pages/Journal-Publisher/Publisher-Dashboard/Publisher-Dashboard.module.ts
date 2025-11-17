import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { PublisherDashboardComponent } from './Publisher-Dashboard.component';


const routes: Routes = [
  {
    path: '',
    component: PublisherDashboardComponent, 
  }
]

@NgModule({
    imports: [
      CommonModule,
      RouterModule.forChild(routes),
  
    ],
  
  })
export class PublisherDashboardModule { }

