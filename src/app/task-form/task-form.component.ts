import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { PotService } from '../pot.service'
import { User } from '../user'
import { ActivatedRoute, Router } from '@angular/router';
import { PotsTask } from '../model/pots-task';

const NUMBER_REGEX = /^(0?[0-9]?[0-9]|1[0-4][0-9]|15[0])$/;

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit {
  departments: Array<any>;
  categories: Array<any>;
  users: Array<any>;
  owners: Array<any>;
  reviewers: Array<any>;
  performers: Array<any>;
  approvers: Array<any>;
  frequencies: Array<any>;

  statuses: Array<any>;
  selectedStatus: number;

  titleInput: string;
  descriptionInput: string;
  selectedDepartment: number;
  selectedCategory: number;
  selectedUser: number;
  selectedOwner: number;
  selectedPerformer: number;
  selectedReviewer: number;
  selectedApprover: number;
  selectedFrequency: number;
  selectedStartDate: Date;
  selectedEndDate: Date;
  remindInput: number;

  data: any;
  task= new PotsTask();
  endDate: any;

  public constructor(
    public potService: PotService,
    public route: ActivatedRoute,
    public router: Router
  ) { }

  frequencyFormControl = new FormControl('', [
    Validators.pattern(NUMBER_REGEX)
  ]);

  ngOnInit() {
    this.Initialize();
  }

  Initialize() {
    this.getUsers();
    this.getDepartments();
    this.getCategories();
    this.getFrequencies();
    this.getStatuses();
  }

  getUsers() {
    this.potService.potsGetUsers().subscribe(res => {
      this.users = res;
    })
  }

  getDepartments() {
    this.potService.potsGetDepartments().subscribe(res => {
      this.departments = res;
    })
  }

  getCategories() {
    this.potService.potsGetCategories().subscribe(res => {
      this.categories = res;
    })
  }

  getFrequencies() {
    this.potService.potsGetFrequencies().subscribe(res => {
      this.frequencies = res;
    })
  }

  getStatuses() {
    this.potService.potsGetStatuses().subscribe(res => {
      this.statuses = res;
      this.selectedStatus = res[0].statusID;
    })
  }

  checkDepartment() {
    this.potService.potsGetUserByDepartment(this.selectedDepartment).subscribe(res => {
      this.owners = res;
      this.performers = res;
      this.reviewers = res;
      this.approvers = res;
    })
  }

  submitTask() {
    if (this.selectedEndDate) {
      this.endDate = this.selectedEndDate.getTime();
    }  else {
      this.endDate = this.selectedEndDate
    }

    this.task.title = this.titleInput;
    this.task.description = this.descriptionInput;
    this.task.departmentID = this.selectedDepartment;
    this.task.categoryID = this.selectedCategory;
    this.task.ownerID = this.selectedOwner;
    this.task.taskStatus = this.selectedStatus;
    this.task.performerID = this.selectedPerformer;
    this.task.reviewerID = this.selectedReviewer;
    this.task.approverID = this.selectedApprover;
    this.task.frequencyID = this.selectedFrequency;
    this.task.startDate = this.selectedStartDate.getTime();
    this.task.endDate = this.endDate;
    this.task.remindDays = this.remindInput;

    //console.log(this.task);     
  
    this.potService.potsAddTask(this.task).subscribe();
    this.router.navigate(['/task-list'])
  }

}
