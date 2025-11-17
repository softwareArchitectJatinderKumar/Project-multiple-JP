import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { NewRegistrationPageComponent } from './new-registration-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TopsliderComponent } from '../topslider/topslider.component';

const routes: Routes = [
  {
    path: '',
    component: NewRegistrationPageComponent, 
  }
]

@NgModule({
    imports: [
      CommonModule,
      RouterModule.forChild(routes),   
      FormsModule,      
    ],
  
  })
 
export class  NewRegistrationPageModule { }

// const routes: Routes = [
//   {    
//     path: '',
//     component: NewRegistrationPageComponent, 
//   }
// ];

// @NgModule({
//   imports: [    
//     CommonModule,
//     RouterModule.forChild(routes),
//     FormsModule,
//     ReactiveFormsModule,
//   ],
//   declarations: [
//     NewRegistrationPageComponent, // Declare your component here
//   ],
//   exports: [
//     NewRegistrationPageComponent // Optionally export it if needed
//   ]
// })
// export class NewRegistrationPageModule { }
