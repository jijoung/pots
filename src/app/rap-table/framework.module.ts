import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdTableModule, MdSortModule, MdInputModule, MdButtonModule, MdDialogModule, MdCardModule, MdTooltipModule } from '@angular/material';
import { RAPTableComponent } from './rap-table.component';
import { CdkTableModule } from '@angular/cdk';
import { ExcelService } from './excel_service';
@NgModule({
    imports: [ 
        CommonModule, 
        MdTableModule,
        MdInputModule,
        CdkTableModule,
        MdButtonModule,
        MdTooltipModule,
        MdCardModule,
        MdSortModule
    ],
    declarations: [ RAPTableComponent ],
    providers: [ExcelService],
    exports: [
     	CommonModule,
        RAPTableComponent
    ]
})
export class RAPFrameworkModule {



 }