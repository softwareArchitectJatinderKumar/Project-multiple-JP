import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {EDNewJournalVolumeComponent } from './EDNewJournalVolume.component';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';   
import { MaterialModule } from 'src/material.module';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule, NgForm } from '@angular/forms';
const routes: Routes = [
  {
    path: '',
    component:EDNewJournalVolumeComponent, 
  }
]

@NgModule({
    imports: [
      CommonModule,
      RouterModule.forChild(routes),
      ReactiveFormsModule
    ],
  
  })

export class EDNewJournalVolumeModule { }
