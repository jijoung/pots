import { Component, OnInit, Optional, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { PotService } from '../pot.service';
import { UserService } from '../user.service';
import { User } from '../user';
import { ActivatedRoute, Router } from '@angular/router';
import { PotsTask } from '../model/pots-task';
import { SubTask, Audit } from '../model/task';
import { Email } from '../model/email';
import { environment } from '../../environments/environment';
import * as moment from 'moment';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

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
  selectedSecondaryOwner: number;
  selectedPerformer: number;
  selectedReviewer: number;
  selectedApprover: number;
  selectedFrequency: number;
  selectedStartDate: Date;
  selectedEndDate: Date;
  remindInput: number;

  // data: any;
  isOneTime = false;
  isOwnerSelected: boolean;
  isPerformerSelected: boolean;
  task= new PotsTask();
  endDate: any;

  // subtaskNumber = 0;
  // subtaskCountList = [];
  // subtaskList = [];
  // viewSubtask: boolean;
  subTask = new SubTask();

  email = new Email();
  url = environment.web_url;

  audit = new Audit();

  public constructor(
    public potService: PotService,
    public route: ActivatedRoute,
    public router: Router,
    @Optional() public dialogRef: MatDialogRef<TaskFormComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private user: UserService,
  ) { }

  taskFormControl = new FormControl('', [
    Validators.required
  ]);

  frequencyFormControl = new FormControl('', [
    Validators.pattern(NUMBER_REGEX)
  ]);

  ngOnInit() {
    this.Initialize();
    if(!this.data){
      this.data = "";
    }
  }

  Initialize() {
    this.getUsers();
    this.getDepartments();
    this.getCategories();
    this.getFrequencies();
    this.getStatuses();
  }

  getUsers() {
    this.potService.potsGetUsers(this.user.getUserDomain()).subscribe(res => {
      this.owners = res;
      this.performers = res;
      this.reviewers = res;
      this.approvers = res;
    })
  }

  getDepartments() {
    this.potService.potsGetDepartments(this.user.getUserName()).subscribe(res => {
      this.departments = res;
    })
  }

  getCategories() {
    this.potService.getCategories(this.user.getUserName()).subscribe(res => {
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

  ownerSelected() {
    this.isOwnerSelected = true;
  }

  performerSelected() {
    this.isPerformerSelected = true;
  }

  submitTask(e) {

    if (this.data) {
      console.log(this.data)
    }

    if (!e.title || !e.description || !e.department || !e.category || !e.owner || !e.performer 
      || !e.frequency || !e.startDate || !this.selectedEndDate) {
      alert("Please fill out all the required fields");
    } else {
      this.task.title = e.title;
      this.task.description = e.description;
      this.task.domainID = this.user.getUserDomain();
      this.task.departmentID = e.department;
      this.task.categoryID = e.category;
      this.task.ownerID = e.owner;
      this.task.secondaryOwnerID = e.secondaryOwner;
      this.task.taskStatus = this.selectedStatus;
      this.task.performerID = e.performer;
      this.task.secondaryPerformerID = e.secondaryPerformer;
      this.task.reviewerID = e.reviewer;
      this.task.approverID = e.approver;
      this.task.frequencyID = e.frequency;
      this.task.startDate = e.startDate.getTime();
      this.task.endDate = this.selectedEndDate.getTime();
      this.task.remindDays = this.remindInput;

      var department = this.departments.find(x => x.departmentID == e.department).name;
      var category = this.categories.find(x => x.categoryID == e.category).name;
      var owner = this.owners.find(x => x.userID == e.owner);
      var performer = this.performers.find(x => x.userID == e.performer);
      var secondaryOwner = this.owners.find(x => x.userID == e.secondaryOwner);
      var secondaryPerformer = this.performers.find(x => x.userID == e.secondaryPerformer);
      var reviewer = this.reviewers.find(x => x.userID == e.reviewer);
      var approver = this.approvers.find(x => x.userID == e.approver);
      var frequency = this.frequencies.find(x => x.frequencyID == e.frequency);
      var start = moment(e.startDate).format('MM/DD/YYYY');
      var end = moment(e.endDate).format('MM/DD/YYYY');
      var remind = this.frequencyFormControl.value;
  
      if (secondaryOwner) {
        var secondaryOwnerName = secondaryOwner.firstName + ' ' + secondaryOwner.lastName;
      }
      if (secondaryPerformer) {
        var secondaryPerformerName = secondaryPerformer.firstName + ' ' + secondaryPerformer.lastName;
      }
      if (reviewer) {
        var reviewerName = reviewer.firstName + ' ' + reviewer.lastName;
      }
  
      if (approver) {
        var approverName = approver.firstName + ' ' + approver.lastName;
      }
  
      this.email.title = 'New Task (' + e.title + ') Sumitted';

      this.email.message = 'Title: ' + e.title
        + '\nDescription: ' + e.description
        + '\nDepartment: ' + department
        + '\nCategory: ' + category
        + '\nOwner: ' + owner.firstName + ' ' + owner.lastName
        + '\nSecondary Owner: ' + secondaryOwnerName
        + '\nPerformer: ' + performer.firstName + ' ' + performer.lastName
        + '\nSecondary Performer: ' + secondaryPerformerName
        + '\nReviewer: ' + reviewerName
        + '\nApprover: ' + approverName
        + '\nFrequency: ' + frequency.period
        + '\nStart Date: ' + start
        + '\nEnd Date: ' + end
        + '\nReminder: ' + remind + ' day(s) before the due date'

      this.email.to = owner.email;
      if (secondaryOwner) {
        this.email.to += ',' + secondaryOwner.email;
      }
      if (reviewer) {
        this.email.to += ',' + reviewer.email;
      }
      if (!reviewer && !approver) {
        this.email.to += ',' + performer.email;
        if (secondaryPerformer) {
          this.email.to += ',' + secondaryPerformer.email;
        }
      }
      // console.log(this.email.to);
    
      this.potService.potsAddTask(this.task).subscribe(response => {        
        this.potService.getLastTask().subscribe(res => {
          this.email.message += '\nURL: ' + this.url + 'edit/' + res[0].taskID;
          this.potService.sendEmail(this.email).subscribe();  
          this.audit.taskID = res[0].taskID;
          this.audit.action = 'SUBMITTED';
          this.audit.userName = this.user.getUserName();
          this.potService.insertAuditLog(this.audit).subscribe();
          if(this.data) {
            this.subTask.parentTaskID = this.data.taskId;
            this.subTask.childTaskID = res[0].taskID;
            console.log(this.subTask);
            this.dialogRef.close();
            this.potService.addSubTask(this.subTask).subscribe();
          }
          // if (this.subtaskList.length > 0) {
          //   for (var item of this.subtaskList) {
          //     item.taskID = res[0].taskID;
          //     this.potService.addSubTask(item).subscribe();
          //   }
          // }
        })

        this.router.navigate(['/task-list'])
      });
    }
  }

  // addSubTask(e) {
  //   if (!e.title || !e.description || !e.department || !e.category || !e.owner || !e.performer 
  //     || !e.frequency || !e.startDate || !this.selectedEndDate) {
  //     alert("Please fill out all the required fields");
  //   } else {
  //     this.subtaskNumber += 1;
  //     this.subtaskCountList.push(this.subtaskNumber);
  //   }
  // }

  // pushSubtask(subtask) {
  //   this.subtaskList.push(subtask);
  //   // console.log(this.subtaskList);
  // }

  // editSubtask(subtask) {
  //   for (var i in this.subtaskList) {
  //     if (this.subtaskList[i].subtaskId == subtask.subtaskId) {
  //       this.subtaskList[i] = subtask;
  //     }
  //   }
  //   //this.viewSubtask = false;
  // }

  // showSubtask() {
  //   if(this.viewSubtask) {
  //     this.viewSubtask = false;
  //   } else {
  //     this.viewSubtask = true;
  //   }
  // }

}
