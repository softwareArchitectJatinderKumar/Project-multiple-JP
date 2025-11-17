import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddNewIssuePageComponent } from './AddNewIssuePage.component';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';   
import { MaterialModule } from 'src/material.module';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule, NgForm } from '@angular/forms';
import { JournalmenubarComponent } from 'src/app/views/pages/journalmenubar/journalmenubar.component';
import { TopsliderComponent } from 'src/app/views/pages/topslider/topslider.component';
import { EditorHeaderComponent } from 'src/app/views/pages/Journal-Editors-AdminDashboard/Editor-Top-Bar/EditorHeader.component';
 
 
const routes: Routes = [
  {
    path: '',
    component: AddNewIssuePageComponent, 
  }
   
]

@NgModule({
 
    imports: [
      CommonModule,
      RouterModule.forChild(routes),
      ReactiveFormsModule,
      
    ],
    
  
  })

export class AddNewIssuePageModule { }



