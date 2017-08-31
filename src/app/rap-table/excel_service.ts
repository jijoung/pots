import { Injectable } from '@angular/core';
import {ColumnOptions } from './ColumnOptions'
import { Headers, Http, Response } from '@angular/http';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/operator/map';


const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable()
export class ExcelService {

    constructor() { }

    public exportToExcel(data : any[], filename:string, columns : ColumnOptions[]){
        let worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);

        this.setHeaders(worksheet, columns);

        const workbook : XLSX.WorkBook = {Sheets: {data: worksheet}, SheetNames: ['data'] };
        const excelBuffer: any = XLSX.write(workbook, {bookType: 'xlsx', type: 'buffer', cellDates: true});
        this.saveFile(excelBuffer, filename);
    }

    private saveFile(buffer: any, fileName: string): void{
        const data: Blob = new Blob([buffer], {
            type: EXCEL_TYPE
        });

        FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
        
    }

    // Set headers to the column options header name instead of the property name
    private setHeaders(worksheet: XLSX.WorkSheet, columns: ColumnOptions[]){
        let columnDict = this.createColDictionary(columns);
        var range = XLSX.utils.decode_range(worksheet['!ref']);
        
        for(var C = range.s.r; C <= range.e.r; ++C){
            var address = XLSX.utils.encode_col(C) + "1";
            if(!worksheet[address]) continue;
            worksheet[address].v = columnDict[worksheet[address].v];
        }
    }

    // Convert the array of column objects to a dictonary {key: attributeName, value: headerName}
    private createColDictionary(columns : ColumnOptions[]){
        var dict = {};
        columns.forEach(col => {
            dict[col.attribute] = col.header; 
        });

        return dict;
    }
}