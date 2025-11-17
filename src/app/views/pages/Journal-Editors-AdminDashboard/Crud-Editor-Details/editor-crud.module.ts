import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'; 

import { EditorCrudComponent } from './editor-crud.component';
import { FormsModule, NgForm } from '@angular/forms';
import { JournalmenubarComponent } from 'src/app/views/pages/journalmenubar/journalmenubar.component';
import { TopsliderComponent } from 'src/app/views/pages/topslider/topslider.component';
import { EditorHeaderComponent } from 'src/app/views/pages/Journal-Editors-AdminDashboard/Editor-Top-Bar/EditorHeader.component';


import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterModule, Routes } from '@angular/router';
const routes: Routes = [
  {
    path: '',
    component: EditorCrudComponent, 
  }
]
@NgModule({
 
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatTableModule,
    MatIconModule,
    MatFormFieldModule,
    RouterModule.forChild(routes),
  ],
 
})
export class EditorCrudModule { }

 


