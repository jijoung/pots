import { Component, OnInit } from '@angular/core';
import { PotService } from '../pot.service';
import { UserService } from '../user.service';
import * as moment from 'moment';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { ActionComponent } from '../action/action.component';
import { Observable } from 'rxjs/Observable';
import { FormControl } from '@angular/forms';
import { User } from '../model/user';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit {

  marginLeft: string;
  marginRight: string;
  line:string;

  startDate: Date;
  endDate: Date;
  today = new Date();
  value:number;

  tasks: Array<any>;

  userCtrl = new FormControl();
  filteredUsers: Observable<User[]>;

  users:Array<User>;
  departments:Array<any>;
  categories:Array<any>;
  frequencies:Array<any>;
  statuses:Array<any>;

  selectedUser: any;
  selectedDepartment: Array<number>;
  selectedCategory: Array<number>;
  selectedFrequency: Array<number>;
  selectedStatus: Array<number>;

  statusColor = {
    OPEN: "#FAFAFA",
    COMPLETE: "#B2DFDB",
    OVERDUE: "#FFCDD2",
    CLOSED: "#BDBDBD"
  }

  constructor(
    public potService: PotService,
    public dialog: MatDialog,
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.initializeFilter();
    this.getTimelineTasks(this.userService.getUserName(), undefined, undefined, undefined, undefined, this.userService.getUserID());
  }

  initializeFilter() {
    this.potService.potsGetUsers(this.userService.getUserDomain()).do(res => this.populateUsers(res)).subscribe();
    this.potService.potsGetDepartments(this.userService.getUserName()).subscribe(res => {
      this.departments = res;
    })
    this.potService.getCategories(this.userService.getUserName()).subscribe(res => {
      this.categories = res;
    })
    this.potService.potsGetFrequencies().subscribe(res => {
      this.frequencies = res;
    })
    this.potService.potsGetStatuses().subscribe(res => {
      this.statuses = res;
    })
  }

  getTimelineTasks(username, departmentList?, categoryList?, frequencyList?, statusList?, userid?) {
    this.potService.getTimelineTask(username, departmentList, categoryList, frequencyList, statusList, userid).subscribe(res => {
      this.tasks = res;
      console.log(this.tasks);
      for (var task of this.tasks) {
        task.progress = new Array<any>();
        task.progress.push(task.status);
        this.startDate = new Date(task.startDate);
        this.endDate = new Date(task.endDate);
        task.startDate = moment(this.startDate).format('MM/DD/YYYY')
        task.endDate = moment(this.endDate).format('MM/DD/YYYY')
        //debugger;
        var period = this.diffInDays(this.startDate, this.endDate);
        var today = this.diffInDays(this.startDate, this.today);
        if (this.today > this.startDate && this.today < this.endDate) {
          task.isToday = true;
          this.value = today / period * 100;
          var val = this.value + (-3/50 * this.value + 3)
          task.line = val + "%";
          task.marginLeft = this.value - 2 + "%";
          task.marginRight = 98 - this.value + "%";
        } else {
          task.line = 0;
          task.marginLeft = 0;
          task.marginRight = 0;
        }
        task.color = this.statusColor[task.status];
        
        //sort subtasks by startdate
        task.childTasks.sort((a,b): number => {
          a.order = 0;
          b.order = 0;
          if (a.startDate < b.startDate) return -1;
          if (a.startDate > b.startDate) return 1;
          return 0
        });

        // sort order
        var sortedSubtasks = new Array<any>();
        this.sortSubTasks(task.childTasks, sortedSubtasks, 1);
        //debugger;
        //console.log(sortedSubtasks);
        task.childTasks = sortedSubtasks;
        var subtasks = new Array<any>();
        for (var subtask of task.childTasks) {
          task.progress.push(subtask.status);
          var subStartDate = new Date(subtask.startDate);
          var subEndDate = new Date(subtask.endDate);
          subtask.startDate = moment(subStartDate).format('MM/DD/YYYY')
          subtask.endDate = moment(subEndDate).format('MM/DD/YYYY')
          var subPeriod = this.diffInDays(subStartDate, subEndDate);
          subtask.widthNumber = subPeriod / period * 100;
          subtask.width = subtask.widthNumber + "%";
          subtasks.push(subtask);
          if (subtasks.length > 1) {
            if (subtasks[0].order == subtasks[1].order) {
              subtask.marginLeftNumber = (this.diffInDays(this.startDate, subStartDate) / period * 100) - subtasks[0].widthNumber - subtasks[0].marginLeftNumber;
              subtask.marginLeft = subtask.marginLeftNumber + "%";
            } else {
              if (task.childTasks.length == 2) {
                subtask.marginRight = "100%";
              } 
              subtask.marginLeftNumber = this.diffInDays(this.startDate, subStartDate) / period * 100;
              subtask.marginLeft = subtask.marginLeftNumber + "%";
            }
            subtasks.shift();
          } else {
            subtask.marginLeftNumber = this.diffInDays(this.startDate, subStartDate) / period * 100;
            subtask.marginLeft = subtask.marginLeftNumber + "%";
          }
          subtask.color = this.statusColor[subtask.status];
          if (subtask.widthNumber < 20) {
            subtask.position = "absolute";
            subtask.paddingLeft = "-1.7em";
            subtask.zIndex = "2";
            subtask.fontSize = "70%";
          }
        }
        //console.log(task.progress);
        task.progress.completed = 0;
        for (var item of task.progress) {
          if (item == "COMPLETE") {
            task.progress.completed++;
          }
        }
        task.completedTask = task.progress.completed / task.progress.length * 100;
        //console.log(task.completedTask);
      }
    })
  }

  populateUsers(res) {
    this.users = res;
    this.filteredUsers = this.userCtrl.valueChanges.startWith(null)
      .map(name => this.filterUsers(name));
  }

  filterUsers(name: string): User[] {
    return this.users.filter(user => new RegExp(`^${name}`, 'gi')
      .test(user.firstName + ' ' + user.lastName));
  }

  displayFn(user: User): string {
    return user ? user.firstName + " " + user.lastName : "";
  }

  diffInDays(date1:Date, date2:Date):number {
    var diff = Math.abs(date1.getTime() - date2.getTime());
    var diffDays = Math.ceil(diff / (1000 * 3600 * 24)); 
    return diffDays;
  }

  sortSubTasks(subtasks:Array<any>, sortedSubTasks:Array<any>, orderNumber) {
    //debugger;
    if(subtasks.length > 0) {
      subtasks.sort((a,b): number => {
        if (a.endDate < b.startDate) {
          return -1;
        }
        if (a.endDate > b.startDate) {
          b.order = orderNumber;
          return 1;
        } 
        return 0
      });

      subtasks.sort((a,b): number => {
        if (a.order < b.order) return -1;
        if (a.order > b.order) return 1;
        return 0
      })

      //debugger;
      var order = subtasks[0].order;
      //console.log(subtasks);
      var subtasksCopy = subtasks.slice();
      for (var i in subtasks) {
        if (subtasks[i].order == order) {
          sortedSubTasks.push(subtasksCopy.shift());
        }
      }
      subtasks = subtasksCopy;
      this.sortSubTasks(subtasks, sortedSubTasks, orderNumber + 1);
    }
    return sortedSubTasks;
  }

  showTask(e) {
    console.log(e);
    let dialogRef = this.dialog.open(ActionComponent, {
      data: e
    });

    dialogRef.afterClosed().subscribe(res => {
      this.getFilteredTask();
    })
  }

  checkUserId() {
    //console.log(this.selectedUser);
    if (this.selectedUser) {
      if (this.selectedUser.userID) {
        this.getFilteredTask();
      }
    }
  }

  getFilteredTask() {
    let departmentList: any;
    let categoryList: any;
    let frequencyList: any;
    let statusList: any;
    let userid: number;

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
    if (this.selectedUser) {
      userid = this.selectedUser.userID;
    }
    console.log(this.selectedUser);
    this.getTimelineTasks(this.userService.getUserName(), departmentList, categoryList,
      frequencyList, statusList, userid);
  }

  clearSelections() {
    this.selectedDepartment = undefined;
    this.selectedCategory = undefined;
    this.frequencies = undefined;
    this.statuses = undefined;
    this.selectedUser = undefined;
    this.getTimelineTasks(this.userService.getUserName(), undefined, undefined,
    undefined, undefined, this.userService.getUserID());
  }
}
