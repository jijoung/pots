import { Component, OnInit } from '@angular/core';
import { PotService } from '../pot.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { isSameDay, isSameMonth} from 'date-fns';
import { Observable } from 'rxjs/Observable';
import { FormControl } from '@angular/forms';
import { User } from '../model/user';

const colors: any = {
  default: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  }
};

const defaults: any = '';

interface Task {
  taskid: number;
  title: string;
  description: string;
  categoryid: number;
  due: string;
}

@Component({
  selector: 'app-task-calendar',
  templateUrl: './task-calendar.component.html',
  styleUrls: ['./task-calendar.component.css']
})
export class TaskCalendarComponent implements OnInit {

  userCtrl: FormControl;
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
  // checkOwner = false;
  // checkPerformer = false;

  view: string = 'month';

  viewDate: Date = new Date();

  position = 'after';

  sample = 'tooltip\nsecond line';

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  events$: Observable<Array<CalendarEvent<{ task: Task }>>>;

  activeDayIsOpen: boolean = false;

  constructor (
    public potService: PotService,
    public route: ActivatedRoute,
    public router: Router
  ) { 
    this.userCtrl = new FormControl();
  }

  ngOnInit() {
    this.initialize();
  }

  initialize() {
    this.populateCalendar();
    this.potService.potsGetUsers().do(res => this.populateUsers(res)).subscribe();
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

  populateCalendar() {
    this.events$ = this.potService.potsGetCalendarTasks('jjoung')
      .map(({ tasks }: { tasks: Task[] }) => {
        return tasks.map((task: Task) => {
          let due = new Date(task.due);
          due.setHours(due.getHours()+4);
          return {
            title: task.title,
            start: due,
            color: colors.default,
            meta: {
              task
            }
          };
        });
      });
  }

  populateUsers(res) {
    this.users = res;
    this.filteredUsers = this.userCtrl.valueChanges.startWith(null)
      .map(name => this.filterUsers(name));
  }

  showTask(e) {
    this.router.navigate(['/action', e.meta.task.taskID]);
  }

  filterUsers(name: string): User[] {
    return this.users.filter(user => new RegExp(`^${name}`, 'gi')
      .test(user.firstName + ' ' + user.lastName));
  }

  displayFn(user: User): string {
    return user ? user.firstName + " " + user.lastName : "";
  }

  checkUserId() {
    if (this.selectedUser) {
      if (this.selectedUser.userId) {
        this.getFilteredTask();
      }
    }
  }

  clearSelections() {
    this.selectedDepartment = undefined;
    this.selectedCategory = undefined;
    this.frequencies = undefined;
    this.statuses = undefined;
    this.selectedUser = undefined;
    this.events$ = this.potService.potsGetCalendarTasks('jjoung', undefined, undefined, undefined
      , undefined, undefined).map(({ tasks }: { tasks: Task[] }) => {
        return tasks.map((task: Task) => {
          let due = new Date(task.due);
          due.setHours(due.getHours()+4);
          return {
            title: task.title,
            start: due,
            color: colors.default,
            meta: {
              task
            }
          };
        });
      });

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
      userid = this.selectedUser.userId;
    }
    //console.log(departmentList, categoryList, frequencyList, statusList, userid)
    this.events$ = this.potService.potsGetCalendarTasks('jjoung', departmentList, categoryList
      , frequencyList, statusList, userid).map(({ tasks }: { tasks: Task[] }) => {
        return tasks.map((task: Task) => {
          let due = new Date(task.due);
          due.setHours(due.getHours()+4);
          return {
            title: task.title,
            start: due,
            color: colors.default,
            meta: {
              task
            }
          };
        });
      });
  }
}
