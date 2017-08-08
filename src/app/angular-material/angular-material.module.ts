import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MaterialModule,
  MdInputModule,
  MdCardModule,
  MdSelectModule,
  MdToolbarModule,
  MdDatepickerModule,
  MdNativeDateModule,
  MdButtonModule,
} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    MdInputModule,
    MdCardModule,
    MdSelectModule,
    MdToolbarModule,
    MdDatepickerModule,
    MdNativeDateModule,
    MdButtonModule
  ],
  exports: [
    MaterialModule,
    MdInputModule,
    MdCardModule,
    MdSelectModule,
    MdToolbarModule,
    MdDatepickerModule,
    MdNativeDateModule,
    MdButtonModule
  ],
  declarations: []
})
export class AngularMaterialModule { }
