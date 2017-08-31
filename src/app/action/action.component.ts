import { Component, OnInit } from '@angular/core';
import { PotService } from '../pot.service';
import { UserService } from '../user.service';
import { ActivatedRoute, Params, Router } from '@angular/router'
import { Task, TaskState, TaskStatus } from '../model/task'


@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.css']
})
export class ActionComponent implements OnInit {

  id = this.route.snapshot.params['id'];
  task = new Task();

  isApprover = false;
  isPerformer = false;

  username: string;
  taskState = new TaskState();
  taskStatus = new TaskStatus();

  constructor(
    public potService: PotService,
    public route: ActivatedRoute,
    public router: Router,
    private user: UserService
  ) { }

  ngOnInit() {
    this.getTaskById();
    this.taskState.taskId = this.id;
    this.taskStatus.taskId = this.id;
  }

  getTaskById() {
    this.potService.potsGetTaskById(this.id).do(res => this.getUserRole(res)).subscribe()
  }

  getUserRole(obj) {
    this.username = this.user.getUserName();
    this.task = obj[0];
    //console.log(this.task);

    if (this.task.statusID === 1) {
      if(this.username === this.task.rUserName){
        this.isApprover = true;
      }
    } else if (this.task.statusID === 2) {
      if (this.username === this.task.aUserName) {
        this.isApprover = true;
      }
    } else if (this.task.statusID === 4 || this.task.statusID === 5) {
      if (this.username === this.task.pUserName) {
        this.isPerformer = true;
      }
    }
  }

  approve() {
    if (this.task.statusID === 1) {
      this.taskState.taskStateId = 2;
    } else if (this.task.statusID === 2) {
      this.taskState.taskStateId = 4;
    } 
    this.potService.potsUpdateTaskState(this.taskState).subscribe();
    this.router.navigate(['/task-list']);
  }

  disapprove() {
    this.taskState.taskStateId = 3;
    this.potService.potsUpdateTaskState(this.taskState).subscribe();
    this.router.navigate(['/task-list']);
  }

  complete() {
    this.taskStatus.taskStatusId = 2
    this.potService.potsUpdateTaskStatus(this.taskStatus).subscribe();
    this.router.navigate(['/task-list']); 
  }
}
