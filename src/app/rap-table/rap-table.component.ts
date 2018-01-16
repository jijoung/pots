import { Component, Input, Output, OnChanges, ViewChild, OnInit, ElementRef, EventEmitter, Inject } from '@angular/core';
import { ColumnOptions } from './ColumnOptions';
import { MatTableModule, MatSortModule, MatSort, MatButtonModule} from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ExcelService } from './excel_service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';


@Component({
    selector: 'rap-table',
    templateUrl: './rap-table.component.html',
		styleUrls: ['./rap_style.css']
})
export class RAPTableComponent<T> implements OnInit { 

	dataSource : RAPDataSource<T>;
	columnSource : RAPDataSource<T>;

	// Required inputs
	@Input() data: T[];
	@Input() cols: ColumnOptions[];
	// @Input() removable: boolean; // Specifiy whether or not to add a delete button column to the table
	@Input() selectedCols: T[];
	//Event emmiter for the remove button
	@Output() onRemove: EventEmitter<T> = new EventEmitter();
	@Output() onUpdate : EventEmitter<T> = new EventEmitter();
	@Output() onSave: EventEmitter<T> = new EventEmitter();

	displayedColumns : string[] = [];
	columnList:any;

	hoveredRow: number;

	filteredData : T[];

	@ViewChild(MatSort) sort: MatSort;
	@ViewChild('filter') filter: ElementRef;

	constructor(
		private excelService :ExcelService,
		public dialog: MatDialog
	) {}

	exportExcel(){
		console.log(this.selectedCols);
		this.excelService.exportToExcel(this.filteredData, "Task_List", this.cols);
	}

	ngOnInit() {
		this.initColumns();
		this.dataSource = new RAPDataSource<T>(this.data, this.sort);
		this.columnSource = new RAPDataSource<T>(this.selectedCols, this.sort);

		//Observe changes in filter input
		Observable.fromEvent(this.filter.nativeElement, 'keyup')
        .debounceTime(150)
        .distinctUntilChanged()
        .subscribe(() => {
          if (!this.dataSource) { return; }
		  this.dataSource.filter = this.filter.nativeElement.value;
        });
		this.dataSource.connect().subscribe( data =>{
			this.filteredData = data;
		})
	}

	ngOnChanges(changes : any){
		if(this.dataSource){
			if(changes.data){
				this.dataSource.updateData(changes.data.currentValue);
			} 
		}
		if(this.columnSource) {
			if(changes.selectedCols) {
				this.displayedColumns = changes.selectedCols.currentValue.displayedColumns;
				this.columnList = changes.selectedCols.currentValue.columnList;
			}
		}
	}

	/* Given column options input, create order that the columns will be displayed on the table */
	initColumns(){
		//console.log(this.selectedCols);
		this.cols.forEach(col =>{
				this.displayedColumns.push(col.attribute);
		});
		// if(this.removable){
		// 	this.displayedColumns.push('removable');
		// }
	}

	selectColumns(){
		//console.log(this.displayedColumns);
		// this.initColumns();
		let dialogRef = this.dialog.open(ColumnDialog, {
			data: { columnList: this.columnList, displayedColumns: this.displayedColumns }
		});

		dialogRef.afterClosed().subscribe(result => {
			if(result) {
				// console.log('below is the result');
				// console.log(result);
				this.displayedColumns = result.displayedColumns;
				this.columnList = result.columnList;
				this.onSave.emit(result);
			}
		});
		//this.ngOnInit();
	}

	removeRow(row : T){	
		this.onRemove.emit(row);	
	}

	updateRow(row :T){
		this.onUpdate.emit(row);
	}

	hoverRow(row: number){
		this.hoveredRow = row;
	}

}

export class Column {
	name:string;
	checked:boolean;
}

@Component({
	selector: 'column-dialog',
	templateUrl: 'column-dialog.html',
	styleUrls: ['./rap_style.css']
})
export class ColumnDialog {

	column:Column;
	columnList = new Array<Column>();
	displayedColumns = new Array<string>();
	returnData:any;

	constructor(
			public dialogRef: MatDialogRef<ColumnDialog>,
			@Inject(MAT_DIALOG_DATA) public data: any) { }

	ngOnInit() {
		// console.log(this.data.columnList);
		// console.log(this.columnList);
		if (!this.data.columnList) {
			for (var item of this.data.displayedColumns){
				this.column = new Column();
				this.column.name = item;
				this.column.checked = true;
				this.columnList.push(this.column);
			}
		} else {
			this.columnList = this.data.columnList;
		}
	}

	saveColumns() {
		//console.log(this.columnList);
		for (var item of this.columnList) {
			if (item.checked) {
				this.displayedColumns.push(item.name);
			}
		}
		this.returnData = {"displayedColumns":this.displayedColumns,"columnList":this.columnList};
		this.dialogRef.close(this.returnData);
		//console.log(this.returnData);
	}
	closeDialog() {
		this.dialogRef.close();
	}
}

export class RAPDataSource<T> extends DataSource<any> {

	dataChange: BehaviorSubject<T[]> = new BehaviorSubject<T[]>([]);
 	_filterChange = new BehaviorSubject('');
  get filter(): string { return this._filterChange.value; }
  set filter(filter: string) { this._filterChange.next(filter); }

	objKeys : string[] = [];

 	constructor(private _data: T[], private _sort: MatSort) {
    super();
		const copiedData = this.dataChange.value.slice();
		copiedData.concat(_data);
		this.dataChange.next(copiedData);
  }

	connect(): Observable<T[]> {
    const displayDataChanges = [
      this.dataChange,
      this._sort.sortChange,
			this._filterChange
    ];
    return Observable.merge(...displayDataChanges).map(() => {
				let _data = this.dataChange.value.slice();
				let split_filter = this.filter.trim().split(" ");
				let filtered = _data.filter((item :T)=>{
							let search = this.concatObjKeys(item).toLowerCase();
							return this.contains_filter(split_filter,search);
				});
      return this.getSortedData(filtered);
    });
  }

	/* Append all properties of an object into a string*/
	concatObjKeys(item : T): string{
		let objVals = "";
		this.objKeys.forEach(key =>{
				objVals+= item[key];
		});

		return objVals;
	}

	/* Check if any part of the search string is contained in the delimited filter array */
	contains_filter(delimited: string[], searchStr){

			for(let i=0; i<delimited.length; i++){
				if(searchStr.indexOf(delimited[i].toLowerCase()) != -1){ return true; }
			}
			return false;
	}

  updateData(data: T[]){
	  this.dataChange.next(data);
		//Set objKeys to all the keys of the given object
		this.objKeys = data.length >0 ? Object.keys(data[0]) : this.objKeys;
  }

  disconnect() {}

  getSortedData(data: T[]): T[] {
    //const data = this.dataChange.value.slice();
    if (!this._sort.active || this._sort.direction == '') { return data; }

    return data.sort((a, b) => {
      let propertyA: number|string = '';
      let propertyB: number|string = '';

	  [propertyA, propertyB] = [a[this._sort.active],b[this._sort.active]];
      let valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      let valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction == 'asc' ? 1 : -1);
    });
  }
}
