import { Component, OnInit } from '@angular/core';
import { PotService } from '../pot.service';
import { UserService } from '../user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ColumnOptions } from '../rap-table/ColumnOptions';
import { ColumnSetting } from '../model/user';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {

  departments: Array<any>;
  categories: Array<any>;
  frequencies: Array<any>;
  statuses: Array<any>;

  selectedDepartment: Array<number>;
  selectedCategory: Array<number>;
  selectedFrequency: Array<number>;
  selectedStatus: Array<number>;
  selectedFromDate: Date;
  selectedToDate: Date;

  columnSettings: Array<ColumnOptions>; 
  columnSetting = new ColumnSetting();
  
  selectedColumns:any;

  taskData: Array<any>;

  constructor(
    public potService: PotService,
    public route: ActivatedRoute,
    public router: Router,
    private user: UserService
  ) { }

  ngOnInit() {
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
    this.getTasks();
    this.InitializeFilter();
  }

  public getTasks() {
    this.potService.potsGetFilteredTasks(this.user.getUserName()).subscribe(res => {
      this.taskData = res;
      //console.log(this.taskData);
      this.getColumnSetting();
    })
  }

  public getColumnSetting() {
    this.potService.getColumnSetting(this.user.getUserID(), this.user.getUserDomain()).subscribe(res => {
      
      if (res[0]) {
        this.selectedColumns = JSON.parse(res[0].selectedColumns);
        //this.taskData.push({selectedColumns: selectedColumns});
        console.log(this.selectedColumns);
      }
    })
  }

  InitializeFilter() {
    this.potService.potsGetDepartments(this.user.getUserName()).subscribe(res => {
      this.departments = res;
    })
    this.potService.getCategories(this.user.getUserName()).subscribe(res => {
      this.categories = res;
    })
    this.potService.potsGetFrequencies().subscribe(res => {
      this.frequencies = res;
    })
    this.potService.getTaskStates().subscribe(res => {
      this.statuses = res;
    })
  }

  public showTask(e) {
    //console.log(e);
    this.router.navigate(['/edit', e.taskID]);
  }

  public showColumns(e) {
    var jsonString = JSON.stringify(e);

    this.columnSetting.userID = this.user.getUserID();
    this.columnSetting.selectedColumns = jsonString;
    this.potService.insertColumnSetting(this.columnSetting).subscribe();
  }

  clearSelections() {

    this.selectedDepartment = undefined;
    this.selectedCategory = undefined;
    this.selectedFrequency = undefined;
    this.selectedStatus = undefined;
    this.selectedFromDate = undefined;
    this.selectedToDate = undefined;
    this.potService.potsGetFilteredTasks(this.user.getUserName(), undefined, undefined, undefined, undefined, undefined, undefined)
                      .subscribe(res => { this.taskData = res; })
  }

  getFilteredTask() {
    let departmentList: any;
    let categoryList: any;
    let frequencyList: any;
    let statusList: any;
    let fromDate: any;
    let toDate: any;

    if (this.selectedDepartment) {
      departmentList = this.selectedDepartment.join();
    }
    if (this.selectedCategory) {
      categoryList = this.selectedCategory.join();
    }
    if (this.selectedFrequency) {
      frequencyList = this.selectedFrequency.join();
    }
    if (this.selectedStatus) {
      statusList = this.selectedStatus.join();
    }
    if (this.selectedFromDate) {
      fromDate = this.selectedFromDate;
      fromDate.setHours(-4);
      fromDate = fromDate.getTime();
    }
    if (this.selectedToDate) {
      toDate = this.selectedToDate;
      toDate.setHours(-4);
      toDate = toDate.getTime();
    }
    //console.log(departmentList, categoryList, frequencyList, statusList, fromDate, toDate);
    this.potService.potsGetFilteredTasks(this.user.getUserName(), departmentList, categoryList, frequencyList, statusList, fromDate, toDate)
                      .subscribe(res => { this.taskData = res; })
  }
}
