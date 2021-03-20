import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

import { EmployeeViewComponent } from './employee-view/employee-view.component';
import { EditEmployeeComponent } from './edit-employee/edit-employee.component';
import {RouterModule, Routes} from "@angular/router";
import {routes} from "./app-routing";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule} from "@angular/material/dialog";
import {MatFormFieldControl, MatFormFieldModule} from "@angular/material/form-field";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import { FiltersComponent } from './filters/filters.component';



@NgModule({
  declarations: [
    AppComponent,
    EmployeeViewComponent,
    EditEmployeeComponent,
    FiltersComponent,

  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatFormFieldModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatInputModule,



  ],
  providers: [ {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}}],
  bootstrap: [AppComponent],
  entryComponents: [EditEmployeeComponent]
})
export class AppModule { }
