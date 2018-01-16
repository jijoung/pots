import { Component, OnInit, Optional, Inject, Input } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import { FormGroup } from '@angular/forms';
import { PotService } from '../pot.service';
import { UserService } from '../user.service';
import { DateService } from '../date.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Task, TaskState, TaskStatus, Audit, Repeat } from '../model/task';
import { Notes } from '../model/notes';
import { Files } from '../model/files';
import { PotsDate } from '../model/pots-date';
import { Email } from '../model/email';
import { environment } from '../../environments/environment';
import * as FileSaver from 'file-saver';
import * as moment from 'moment';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

const dateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.css']
})

export class ActionComponent implements OnInit {

  api_url = environment.api_url;

  id = this.route.snapshot.params['id'];
  task = new Task();
  updated: Date;
  http: Http;
  fileInfoList: Array<any>;
  notesList: Array<any>;
  fileList: FileList;
  file = new Files();
  note: string;
  reminds: Array<any>;
  selectedRemind: number;
  tempFile: Blob;
  position = "right";

  isApprover = false;
  isPerformer = false;
  isOwner = false;
  isSecondaryOwnerExist: boolean;
  isSecondaryPerformerExist: boolean;

  username: string;
  taskState = new TaskState();
  taskStatus = new TaskStatus();
  updateTime = new PotsDate();

  email = new Email();
  taskDetail: string;
  url = environment.web_url;

  audit = new Audit();
  repeat = new Repeat();

  @Input() taskID: number;

  constructor(
    public potService: PotService,
    public route: ActivatedRoute,
    public router: Router,
    public date: DateService,
    @Optional() public dialogRef: MatDialogRef<ActionComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private user: UserService,
  ) { }

  ngOnInit() {
    if (this.data) {
      console.log(this.data);
      this.id = this.data.actionTaskID;
    } else if (this.taskID) {
      this.id = this.taskID;
    }
    this.getTaskById();
    this.getFileInfo();
    this.getNotes();
    this.taskState.taskId = this.id;
    this.taskStatus.taskId = this.id;
    this.getRepeat();
  }

  getTaskById() {
    this.potService.potsGetTaskById(this.id).do(res => this.getUserRole(res)).subscribe()
  }

  getUserRole(obj) {
    this.username = this.user.getUserName();
    this.task = obj[0];
    console.log(this.task);
    this.taskDetail = "\nTitle: " + this.task.title
    + "\nDescription: " + this.task.description
    + "\nOwner: " + this.task.owner
    + "\nSecondary Owner: " + this.task.secondaryOwner
    + "\nPerformer: " + this.task.performer
    + "\nSecondary Performer: " + this.task.secondaryPerformer
    + "\nReviwer: " + this.task.reviewer
    + "\nApprover: " + this.task.approver
    + "\nDue Date: " + this.task.due
    //debugger;
    if (this.task.updated !== '') {
      //console.log(this.task.updated);
      var utcDate = moment.utc(this.task.updated).toDate();
      this.task.updated = moment(utcDate).local().format('MM/DD/YYYY hh:mmA');
    }
    if (this.task.completed !== '') {
      var utcDate = moment.utc(this.task.completed).toDate();
      this.task.completed = moment(utcDate).local().format('MM/DD/YYYY hh:mmA');      
    }
    if (this.task.stateID === 4 || this.task.stateID === 5) { //Task is assigned or approved
      if (this.username === this.task.pUserName || this.username === this.task.spUserName) {
        if (this.task.statusID == 2 || this.task.statusID == 4) {
          this.isPerformer = false;
        } else {
          this.isPerformer = true;
        }
      }
    }
    if (this.task.secondaryOwner) {
      this.isSecondaryOwnerExist = true;
    }
    if (this.task.secondaryPerformer) {
      this.isSecondaryPerformerExist = true;
    }
  }

  emailTo(): string {
    this.email.to = this.task.oEmail
    if (this.task.rEmail) {
      this.email.to += ',' + this.task.rEmail;
    }
    if (this.task.aEmail) {
      this.email.to += ',' + this.task.aEmail;
    }
    return this.email.to;
  }

  complete() {
    this.email.title = "Task(" + this.task.title + ") Completed"
    this.email.to = this.emailTo();

    this.email.message = "Following task is completed: "
      + this.taskDetail
      + "\nCompleted: " +  moment().format('MM/DD/YYYY hh:mmA')
      + '\nURL: ' + this.url + 'action/' + this.id;
    
    this.potService.sendEmail(this.email).subscribe();
    this.taskStatus.taskStatusId = 2
    this.potService.updateTaskStatus(this.taskStatus).subscribe(res => {
      if (this.dialogRef) {
        this.dialogRef.close();
      } else {
        this.router.navigate(['/task-calendar']); 
      }  
      this.audit.taskID = this.id;
      this.audit.action = 'COMPLETED';
      this.audit.userName = this.user.getUserName();
      this.potService.insertAuditLog(this.audit).subscribe();
    });
  }

  close() {
    this.email.title = "Task(" + this.task.title + ") Closed"
    this.email.to = this.emailTo();
    
    this.email.message = "Following task is closed: "
      + this.taskDetail
      + "\nClosed: " +  moment().format('MM/DD/YYYY hh:mmA')
      + '\nURL: ' + this.url + 'action/' + this.id;

    this.potService.sendEmail(this.email).subscribe();
    this.taskStatus.taskStatusId = 4
    this.potService.updateTaskStatus(this.taskStatus).subscribe(res => {
      if (this.dialogRef) {
        this.dialogRef.close();
      } else {
        this.router.navigate(['/task-calendar']);
      }
      this.audit.taskID = this.id;
      this.audit.action = 'CLOSED';
      this.audit.userName = this.user.getUserName();
      this.potService.insertAuditLog(this.audit).subscribe();
    });
  }

  update() {

    if (this.note || this.fileList || this.selectedRemind) {
      var now = new Date();
      //var utcDate = this.date.convertLocalToUtc(now, now.getTimezoneOffset());

      this.updateTime.taskId = this.id;
      this.updateTime.updatedTime = now;

      this.potService.updateUpdatedTime(this.updateTime).subscribe();

      // insert repeatID 
      if (this.selectedRemind) {
        this.repeat.taskID = this.id;
        this.repeat.repeatID = this.selectedRemind;
        this.potService.updateRepeatID(this.repeat).subscribe();
      }

      // insert note
      if (this.note) {
        let notes = new Notes();
        notes.taskId = this.id;
        notes.note = this.note; 
    
        this.potService.InsertNotes(notes).subscribe(res => {
          this.note = undefined;
          this.ngOnInit();
        });
      }
      // insert file(s)
      if(this.fileList) {
        for (var i = 0; i < this.fileList.length; i++) {
          let file: File = this.fileList[i];
          let formData = new FormData();
          formData.append('file', file);
          this.file.data = formData;
          this.file.id = this.id;
          this.potService.uploadFile(this.id, formData).subscribe(res => {
            this.ngOnInit();
          });
        }
        (<HTMLInputElement>document.getElementById('file')).value = '';
      }
      // record update time

    }
  }

  getFileInfo() {
    this.potService.getFileInfo(this.id).subscribe(res => {
      this.fileInfoList = res;
    })
  }

  getNotes() {
    this.potService.getNotes(this.id).subscribe(res => {
      //console.log(res);
      this.notesList = res;
    })
  }

  getRepeat() {
    this.potService.getRepeat().subscribe(res => {
      this.reminds = res;
    })
  }

  getFile(fileName) {
    let filePath = '\\\\nts0018\\Bond\\POTS\\Storage\\' + fileName;
    this.potService.getFile(filePath).subscribe(res => {
      this.tempFile = res;
      FileSaver.saveAs(this.tempFile, fileName);
    });
  }

  fileChange(event) { 
    this.fileList = event.target.files;
  }

  remove(fileInfo) {
    this.potService.DeleteFile(fileInfo).subscribe(res => {
      this.ngOnInit();
    });
  }

  editTask() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
    this.router.navigate(['/edit', this.task.parentTaskID]);
  }
}
