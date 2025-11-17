import { EDAllJournalVolumesComponent } from './EDAllJournalVolumes.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule } from 'src/material.module';


const routes: Routes = [
  {
    path: '',
    component: EDAllJournalVolumesComponent,
  }
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule,
  ],

})
export class EDAllJournalVolumesModule { }
