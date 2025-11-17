import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { UpdateJournalDetailsComponent } from './update-journal-details.component';

const routes: Routes = [
  {
    path: '',
    component: UpdateJournalDetailsComponent, 
  }
]

@NgModule({
 
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class UpdateJournalDetailsModule { }
