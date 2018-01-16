import { Component, OnInit } from '@angular/core';
import { PotService } from '../pot.service';
import { UserService } from '../user.service';
import { ColumnOptions } from '../rap-table/ColumnOptions';
import { ColumnSetting } from '../model/user';

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.css']
})

export class FieldComponent implements OnInit {

  departments:Array<any>;
  categories:Array<any>;

  name:string;
  category: string;

  columnSettings: Array<ColumnOptions>;
  columns= new ColumnSetting();
  selectedColumns:any;

  constructor(
    public potService:PotService,
    private userService:UserService
  ) { }

  ngOnInit() {
    this.potService.getFilters(this.userService.getUserName()).subscribe(res => {
      this.departments = res.departments;
      this.categories = res.categories;
    })
    this.columnSettings = [
      {attribute:"title" , header:"Title"}, 
      {attribute:"category" , header:"Category"},
      {attribute:"frequency", header:"Frequency"},
      {attribute:"owner" , header:"Owner"},
      {attribute:"performer" , header:"Performer"},
      {attribute:"reviewer" , header:"Reviewer"},
      {attribute:"approver" , header:"Approver"},
      {attribute:"start" , header:"Start Date"},
      {attribute:"end" , header:"Expiration Date"},
      {attribute:"status" , header:"State"},
      {attribute:"remind" , header:"Remind"},
    ]
    this.getColumnSetting();
  }

  addDepartment(department) {
    console.log(department);
    if(department.name){
      department.domainID = window.window.localStorage.getItem('domain');
      this.potService.InsertDepartment(department).subscribe(res => {
        this.name = undefined;
        this.ngOnInit();
      });
    }
  }

  addCategory(e) {
    if(e.category) {
      var category = e;
      category.name = e.category;
      category.domainID = window.window.localStorage.getItem('domain');
      this.potService.insertCategory(category).subscribe(res => {
        this.category = undefined;
        this.ngOnInit();
      })
    }
  }

  public showColumns(e) {
    var jsonString = JSON.stringify(e);

    this.columns.domainID = this.userService.getUserDomain();
    this.columns.selectedColumns = jsonString;
    console.log(this.columns);
    this.potService.insertColumnSetting(this.columns).subscribe();
  }

  public getColumnSetting() {
    this.potService.getColumnSetting(0, this.userService.getUserDomain()).subscribe(res => {
      
      if (res[0]) {
        this.selectedColumns = JSON.parse(res[0].selectedColumns);
        //this.taskData.push({selectedColumns: selectedColumns});
        console.log(this.selectedColumns);
      }
    })
  }
}
