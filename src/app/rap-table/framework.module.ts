import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
    MatTableModule, 
    MatSortModule, 
    MatInputModule, 
    MatButtonModule, 
    MatDialogModule, 
    MatCardModule, 
    MatTooltipModule, 
    MatIconModule,
    MatSelectModule,
    MatCheckboxModule,
    MatListModule,
    MatProgressSpinnerModule } from '@angular/material';
import { RAPTableComponent, ColumnDialog } from './rap-table.component';
import { CdkTableModule } from '@angular/cdk/table';
import { ExcelService } from './excel_service';
import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [ 
        CommonModule, 
        MatTableModule,
        MatInputModule,
        CdkTableModule,
        MatButtonModule,
        MatTooltipModule,
        MatCardModule,
        MatSortModule,
        MatIconModule,
        MatSelectModule,
        FormsModule,
        MatCheckboxModule,
        MatListModule,
        MatProgressSpinnerModule
    ],
    declarations: [ RAPTableComponent, ColumnDialog ],
    providers: [ExcelService],
    entryComponents: [ColumnDialog],
    exports: [
     	CommonModule,
        RAPTableComponent,
        ColumnDialog
    ]
})
export class RAPFrameworkModule {



 }