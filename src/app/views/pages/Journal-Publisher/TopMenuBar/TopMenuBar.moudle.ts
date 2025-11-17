import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { TopMenuBarComponent } from './TopMenuBar.component';


const routes: Routes = [
  {
    path: '',
    component: TopMenuBarComponent, 
  }
]

@NgModule({
    imports: [
      CommonModule,
      RouterModule.forChild(routes),
  
    ],
  
  })
export class TopMenuBarModule { }