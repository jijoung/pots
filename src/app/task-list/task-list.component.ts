import { Component, OnInit } from '@angular/core';
import { PotService } from '../pot.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ColumnOptions } from '../rap-table/ColumnOptions';

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

  columnSettings: Array<ColumnOptions> = [
    {attribute:"category" , header:"Category"},
    {attribute:"title" , header:"Title"}, 
    {attribute:"frequency", header:"Frequency"},
    {attribute:"owner" , header:"Owner"},
    {attribute:"performer" , header:"Performer"},
    {attribute:"reviewer" , header:"Reviewer"},
    {attribute:"approver" , header:"Approver"},
    {attribute:"start" , header:"Start Date"},
    {attribute:"end" , header:"Expiration Date"},
    {attribute:"status" , header:"Status"},
  ]  

  taskData: Array<any>;

  constructor(
    public potService: PotService,
    public route: ActivatedRoute,
    public router: Router
  ) { }

  ngOnInit() {
    this.getTasks();
    this.InitializeFilter();
  }

  public getTasks() {
    this.potService.potsGetTasks('jjoung').subscribe(res => {
      this.taskData = res;
    })
  }

  InitializeFilter() {
    this.potService.potsGetDepartments().subscribe(res => {
      this.departments = res;
    })
    this.potService.potsGetCategories().subscribe(res => {
      this.categories = res;
    })
    this.potService.potsGetFrequencies().subscribe(res => {
      this.frequencies = res;
    })
    this.potService.potsGetStatuses().subscribe(res => {
      this.statuses = res;
    })
  }

  public showTask(e) {
    //console.log(e);
    this.router.navigate(['/action', e.taskID]);
  }

  clearSelections() {
    this.selectedDepartment = undefined;
    this.selectedCategory = undefined;
    this.selectedFrequency = undefined;
    this.selectedStatus = undefined;
    this.selectedFromDate = undefined;
    this.selectedToDate = undefined;
    this.potService.potsGetFilteredTasks(undefined, undefined, undefined, undefined, undefined, undefined)
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
    this.potService.potsGetFilteredTasks(departmentList, categoryList, frequencyList, statusList, fromDate, toDate)
                      .subscribe(res => { this.taskData = res; })
  }
}
