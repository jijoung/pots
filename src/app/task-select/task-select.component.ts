import { Component, OnInit, Optional, Inject } from '@angular/core';
import { PotService } from '../pot.service';
import { UserService } from '../user.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { SubTask } from '../model/task';

@Component({
  selector: 'app-task-select',
  templateUrl: './task-select.component.html',
  styleUrls: ['./task-select.component.css']
})
export class TaskSelectComponent implements OnInit {

  tasks:Array<any>;
  selectedValue: any;
  subTask = new SubTask();

  constructor(
    public potService: PotService,
    private userService: UserService,
    @Optional() public dialogRef: MatDialogRef<TaskSelectComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() {
    //console.log(this.data);
    this.potService.getSubTaskList(this.data.taskID).subscribe(res => {
      this.tasks = res;
      //console.log(this.tasks);
    })
  }

  mapTask(selected) {
    //console.log(e);
    for (var item of selected) {
      this.subTask.parentTaskID = this.data.taskID;
      this.subTask.childTaskID = item.value;
      //console.log(item.value);
      this.potService.addSubTask(this.subTask).subscribe();
      this.dialogRef.close();
    }
  }

}
