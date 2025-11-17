import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { JournalauthorComponent } from './journalauthor.component';

const routes: Routes = [
  {
    path: '',
    component: JournalauthorComponent, 
  }
]

@NgModule({
    imports: [
      CommonModule,
      RouterModule.forChild(routes),  
    ],
  
  })
export class JournalauthorComponentModule { }
