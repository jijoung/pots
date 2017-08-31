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
  MdIconModule,
  MdSidenavModule,
  MdListModule,
  MdTableModule,
  MdSortModule,
  MdDialogModule,
  MdTooltipModule ,
  MdChipsModule,
  MdCheckboxModule,
  MdAutocompleteModule
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
    MdButtonModule,
    MdIconModule,
    MdSidenavModule,
    MdListModule,
    MdTableModule,
    MdSortModule,
    MdDialogModule,
    MdTooltipModule,
    MdChipsModule,
    MdCheckboxModule,
    MdAutocompleteModule
  ],
  exports: [
    MaterialModule,
    MdInputModule,
    MdCardModule,
    MdSelectModule,
    MdToolbarModule,
    MdDatepickerModule,
    MdNativeDateModule,
    MdButtonModule,
    MdIconModule,
    MdSidenavModule,
    MdListModule,
    MdTableModule,
    MdSortModule,
    MdDialogModule,
    MdTooltipModule,
    MdChipsModule,
    MdCheckboxModule,
    MdAutocompleteModule 
  ],
  declarations: []
})
export class AngularMaterialModule { }
