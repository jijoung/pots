import { Component, OnInit } from '@angular/core';
import { PotService } from '../pot.service';
import { UserService } from '../user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { Observable } from 'rxjs/Observable';
import { FormControl } from '@angular/forms';
import { User } from '../model/user';

const colors: any = {
  default: {
    primary: '#BDBDBD', //grey-400
    secondary: '#E0E0E0' //grey-300
  }
};

const defaults: any = '';

interface Task {
  taskid: number;
  title: string;
  description: string;
  categoryid: number;
  due: string;
  color: string;
  icon: string;
  img: string;
}

@Component({
  selector: 'app-task-calendar',
  templateUrl: './task-calendar.component.html',
  styleUrls: ['./task-calendar.component.css']
})
export class TaskCalendarComponent implements OnInit {

  status = this.route.snapshot.params['status'];

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
    public router: Router,
    private user: UserService
  ) { 
    this.userCtrl = new FormControl();
  }

  ngOnInit() {
    this.initialize();
    
  }

  initialize() {
    this.populateCalendar();
    this.potService.potsGetUsers(this.user.getUserDomain()).do(res => this.populateUsers(res)).subscribe();
    this.potService.potsGetDepartments(this.user.getUserName()).subscribe(res => {
      this.departments = res;
    })
    this.potService.getCategories(this.user.getUserName()).subscribe(res => {
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
    //debugger;
    //console.log(this.user.getUserRole());
    this.events$ = this.potService.potsGetCalendarTasks(this.user.getUserName(), undefined, undefined, undefined, undefined, this.user.getUserID())
      .map(({ tasks }: { tasks: Task[] }) => {
        return tasks.map((task: Task) => {
          let due = new Date(task.due);
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

    if (this.status) {
      console.log(this.status);
      if (this.status == 'open') {
        this.selectedStatus = [1];
      } else if (this.status == 'complete') {
        this.selectedStatus = [2];
      } else if (this.status == 'overdue') {
        this.selectedStatus = [3];
      } else if (this.status == 'closed') {
        this.selectedStatus = [4];
      } else {
        console.log(this.users);
        let x = this.status.split(" ")
        let firstName = x[0];
        let lastName = x[1];
        this.selectedUser = this.users.find(x => x.firstName == firstName && x.lastName == lastName);
      }
      this.getFilteredTask();
    }
  }

  showTask(e) {
    //console.log(e);
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
    console.log(this.selectedUser);
    if (this.selectedUser) {
      if (this.selectedUser.userID) {
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
    this.events$ = this.potService.potsGetCalendarTasks(this.user.getUserName(), undefined, undefined, undefined
      , undefined, this.user.getUserID()).map(({ tasks }: { tasks: Task[] }) => {
        return tasks.map((task: Task) => {
          let due = new Date(task.due);
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
      userid = this.selectedUser.userID;
    }
    //console.log(departmentList, categoryList, frequencyList, statusList, userid)
    this.events$ = this.potService.potsGetCalendarTasks(this.user.getUserName(), departmentList, categoryList
      , frequencyList, statusList, userid).map(({ tasks }: { tasks: Task[] }) => {
        return tasks.map((task: Task) => {
          let due = new Date(task.due);
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

  handleEvent(e) {
    console.log(e);
  }
}
