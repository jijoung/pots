import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { PotService } from '../pot.service';
import { PotsTask, TaskState, InsertTask, Audit } from '../model/task';
import { UserService } from '../user.service';
import { Email } from '../model/email';
import { environment } from '../../environments/environment';
import * as moment from 'moment';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { TaskFormComponent } from '../task-form/task-form.component';
import { TaskSelectComponent } from '../task-select/task-select.component';

const NUMBER_REGEX = /^(0?[0-9]?[0-9]|1[0-4][0-9]|15[0])$/;

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  id = this.route.snapshot.params['id'];
  task = new PotsTask();
  originalTask = new InsertTask();
  updatedTask = new InsertTask();

  departments: Array<any>;
  categories: Array<any>;
  owners: Array<any>;
  performers: Array<any>;
  reviewers: Array<any>;
  approvers: Array<any>;
  frequencies: Array<any>;

  username: string;
  isApprover: boolean;
  isOwner: boolean;
  isPerformer: boolean;

  taskState = new TaskState();

  viewSubtask = false;
  isEdit = true;
  subtaskList = [];

  email = new Email();  
  url = environment.web_url;
  taskDetail: string;

  audit = new Audit();
  
  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public potService: PotService,
    public dialog: MatDialog,
    private user: UserService
  ) { }

  frequencyFormControl = new FormControl('', [
    Validators.pattern(NUMBER_REGEX)
  ]);

  ngOnInit() {
    // console.log("role: " + this.user.getUserRole());
    this.initialize();
  }

  initialize() {
    this.potService.getTaskInfo(this.id).subscribe(res => {
      this.task = res[0];
      this.task.startDate = new Date(this.task.startDate);
      this.task.endDate = new Date(this.task.endDate);
      this.taskDetail = '\nTitle: ' + this.task.title + '\nDescription: ' + this.task.description
      + '\nDepartment: ' + this.task.department
      + '\nCategory: ' + this.task.category
      + '\nOwner: ' + this.task.owner + '\nPerformer: ' + this.task.performer + '\nReviwer: ' + this.task.reviewer + '\nApprover: ' + this.task.approver
      + '\nStart Date: ' + moment(this.task.startDate).format('MM/DD/YYYY')
      + '\nEnd Date: ' + moment(this.task.endDate).format('MM/DD/YYYY')
      + '\nURL: ' + this.url + 'edit/' + this.id;
      //console.log(this.taskDetail);
      this.potService.potsGetDepartments(this.user.getUserName()).subscribe(res => {
        this.departments = res;
      })
      this.potService.getCategories(this.user.getUserName()).subscribe(res => {
        this.categories = res;
      })
      this.potService.potsGetUsers(this.user.getUserDomain()).subscribe(res => {
        this.owners = res;
        this.performers = res;
        this.reviewers = res;
        this.approvers = res;
      })
      this.potService.potsGetFrequencies().subscribe(res => {
        this.frequencies = res;
      })
      this.getUserRole(res);
      this.taskState.taskId = this.id;
      this.originalTask.title = this.task.title;
      this.originalTask.description = this.task.description;
      this.originalTask.domainID = this.user.getUserDomain();
      this.originalTask.departmentID = this.task.departmentID;
      this.originalTask.categoryID = this.task.categoryID;
      this.originalTask.ownerID = this.task.ownerID;
      this.originalTask.secondaryOwnerID = this.task.secondaryOwnerID;
      this.originalTask.taskStatus = 1;
      this.originalTask.performerID = this.task.performerID
      this.originalTask.secondaryPerformerID = this.task.secondaryPerformerID;
      this.originalTask.reviewerID = this.task.reviewerID;
      this.originalTask.approverID = this.task.approverID;
      this.originalTask.frequencyID = this.task.frequencyID;
      this.originalTask.startDate = this.task.startDate.getTime();
      this.originalTask.endDate = this.task.endDate.getTime();
      this.originalTask.remindDays = this.task.remindDays;
    })
    // this.potService.getSubTasks(this.id).subscribe(res => {
    //   this.subtaskList = res;
    //   for (var item of this.subtaskList) {
    //     item.targetDate = new Date(item.targetDate);
    //   }
    // })
  }

  getUserRole(obj) {
    this.username = this.user.getUserName();
    this.task = obj[0];
    //console.log(this.task);

    //debugger;
    if(this.username === this.task.oUserName || this.username === this.task.soUserName || this.user.getUserRole() === "1") {
      this.isOwner = true;
    }

    if (this.task.stateID === 1) {
      if(this.username === this.task.rUserName){
        this.isApprover = true;
      }
    } else if (this.task.stateID === 2) {
      if (this.username === this.task.aUserName) {
        this.isApprover = true;
      }
    }
  }

  approve() {
    //debugger;
    if (this.task.stateID === 1) { //Pending(Reviwer)
      if (this.task.aUserName == ''){
        this.taskState.taskStateId = 4; //Approved
        this.email.to = this.task.oEmail + ',' + this.task.pEmail;
        this.email.message = 'Following task is approved by the reveiwer and ready to proceed:' 
          + '\nAssigned to: ' + this.task.performer
          + this.taskDetail;
      } else {
        this.taskState.taskStateId = 2; //Pending(Approver)
        this.email.to = this.task.oEmail + ',' + this.task.aEmail;
        this.email.message = 'Following task is approved by the reveiwer and waiting for the approver\'s decision: ' 
          + '\nCurrent state: Waiting for ' + this.task.approver + '\'s approval'
          + this.taskDetail;
      }
    } else if (this.task.stateID === 2) {
      this.taskState.taskStateId = 4;
      this.email.to = this.task.oEmail + ',' + this.task.pEmail;
      this.email.message = 'Following task is approved by the approver and ready to proceed:' 
        + '\nAssigned to: ' + this.task.performer
        + this.taskDetail;
    } 

    this.email.title = "Task(" + this.task.title + ") Approved"

    this.potService.sendEmail(this.email).subscribe();
    this.potService.updateTaskState(this.taskState).subscribe(res => {
      this.audit.taskID = this.id;
      this.audit.action = 'APPROVED';
      this.audit.userName = this.user.getUserName();
      this.potService.insertAuditLog(this.audit).subscribe();
      this.router.navigate(['/task-list']);
    });
  }

  disapprove() {
    this.taskState.taskStateId = 3;
    this.email.title = "Task(" + this.task.title + ") Disapproved"
    this.email.to = this.task.oEmail
    if (this.task.rEmail) {
      this.email.to += ',' + this.task.rEmail;
    }
    if (this.task.aEmail) {
      this.email.to += ',' + this.task.aEmail;
    }
    this.email.message = "Following task is rejected: "
      + this.taskDetail;

    this.potService.sendEmail(this.email).subscribe();
    this.potService.updateTaskState(this.taskState).subscribe(res => {
      this.audit.taskID = this.id;
      this.audit.action = 'DISAPPROVED';
      this.audit.userName = this.user.getUserName();
      this.potService.insertAuditLog(this.audit).subscribe();
      this.router.navigate(['/task-list']);
    });
  }

  delete() {
    this.potService.DeleteTask(this.task).subscribe(res => console.log(res)
      ,error => console.log(error), ()=> {
        this.audit.taskID = this.id;
        this.audit.action = 'DELETED';
        this.audit.userName = this.user.getUserName();
        this.potService.insertAuditLog(this.audit).subscribe();
        this.router.navigate(['/task-list']);
      });
  }

  editTask(e) {
    //debugger;
    this.updatedTask.taskID = this.task.taskID;
    this.updatedTask.title = this.task.title;
    this.updatedTask.description = this.task.description;
    this.updatedTask.domainID = this.user.getUserDomain();
    this.updatedTask.departmentID = this.task.departmentID;
    this.updatedTask.categoryID = this.task.categoryID;
    this.updatedTask.ownerID = this.task.ownerID;
    this.updatedTask.secondaryOwnerID = this.task.secondaryOwnerID;
    this.updatedTask.taskStatus = 1;
    this.updatedTask.taskState = this.task.stateID;
    this.updatedTask.performerID = this.task.performerID
    this.updatedTask.secondaryPerformerID = this.task.secondaryPerformerID;
    this.updatedTask.reviewerID = this.task.reviewerID;
    this.updatedTask.approverID = this.task.approverID;
    this.updatedTask.frequencyID = this.task.frequencyID;
    this.updatedTask.startDate = this.task.startDate.getTime();
    this.updatedTask.endDate = this.task.endDate.getTime();
    this.updatedTask.remindDays = this.task.remindDays;

    if (this.originalTask.frequencyID != this.updatedTask.frequencyID 
      || this.originalTask.startDate != this.updatedTask.startDate || this.originalTask.endDate != this.updatedTask.endDate) {
        this.potService.potsAddTask(this.updatedTask).subscribe();
        this.potService.DeleteTask(this.task).subscribe(res => {
          this.router.navigate(['/task-list']);
        });
      }
    else if (this.originalTask.departmentID != this.updatedTask.departmentID 
      || this.originalTask.categoryID != this.updatedTask.categoryID 
      || this.originalTask.ownerID != this.updatedTask.ownerID 
      || this.originalTask.performerID != this.updatedTask.performerID
      || this.originalTask.reviewerID != this.updatedTask.reviewerID
      || this.originalTask.approverID != this.updatedTask.approverID) {
        if (this.updatedTask.reviewerID != 0) {
          this.updatedTask.taskState = 1;
        } else if (this.updatedTask.approverID != 0) {
          this.updatedTask.taskState = 2;
        } else {
          this.updatedTask.taskState = 5;
        }
        this.potService.updateTask(this.updatedTask).subscribe(res => {
          this.router.navigate(['/task-list']);
        });
      }
    else {
      this.potService.updateTask(this.updatedTask).subscribe(res => {
        this.router.navigate(['/task-list']);
      });
    }

    this.audit.taskID = this.id;
    this.audit.action = 'UPDATED';
    this.audit.userName = this.user.getUserName();
    this.potService.insertAuditLog(this.audit).subscribe();
  }

  showSubTask() {
    this.viewSubtask = (this.viewSubtask == false ? true : false);
  }

  openTaskForm() {
    let dialogRef = this.dialog.open(TaskFormComponent, {data: {
      taskId: this.id, 
      startDate: this.addDays(this.task.startDate, -this.task.remindDays), 
      endDate: this.task.endDate
    } });
  }

  openTaskList() {
    this.dialog.open(TaskSelectComponent, {
      height: '600px',
      data: this.task
    });
  }

  addDays(date: Date, days: number): Date {
    date.setDate(date.getDate() + days);
    return date;
  }

}
