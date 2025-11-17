import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';  // ✅ Ensure this is here
import { RecoverAccountComponent } from './recover-account.component';
import { MaterialModule } from 'src/material.module';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule, NgForm } from '@angular/forms';
const routes: Routes = [
  {
    path: '',
    component: RecoverAccountComponent, 
  }
]

@NgModule({
    imports: [
      CommonModule,
      RouterModule.forChild(routes),
      ReactiveFormsModule
    ],
  
  })
export class RecoverAccountComponentModule { }




 

// import { NgModule } from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser';
// import { ReactiveFormsModule } from '@angular/forms'; 
// import { CommonModule } from '@angular/common';
// import { Routes, RouterModule } from '@angular/router';
// import { RecoverAccountComponent } from './recover-account.component';

// import { FormsModule, NgForm } from '@angular/forms';
// import { MatPaginatorModule } from '@angular/material/paginator';
// import { MatDialogModule } from '@angular/material/dialog';
// import { MaterialModule } from 'src/material.module';

// const routes: Routes = [
//   {
//     path: '',
//     component: RecoverAccountComponent, 
//   }
// ]

// @NgModule({
//     imports: [
//       CommonModule,
//       RouterModule.forChild(routes),     
//       MatPaginatorModule,
//       FormsModule,
//       MaterialModule,
//       MatDialogModule
//       // FeatherIconModule,
//       // NgbDropdownModule,
//       // NgbDatepickerModule,
//       // NgApexchartsModule,
//       // NgxDatatableModule,
//       // NgbNavModule,
//       // NgbCollapseModule,
//       // PerfectScrollbarModule,
//       // NgbModule,
//       // ReactiveFormsModule,
//       // NgSelectModule,
//       // MaterialModule
//     ],  
//   })
 
//   export class RecoverAccountModule { }