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
    MdNativeDateModule
  ],
  exports: [
    MaterialModule,
    MdInputModule,
    MdCardModule,
    MdSelectModule,
    MdToolbarModule,
    MdDatepickerModule,
    MdNativeDateModule
  ],
  declarations: []
})
export class AngularMaterialModule { }
