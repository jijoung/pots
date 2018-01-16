import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { PotService } from '../pot.service';
import { UserService } from '../user.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ActionComponent } from '../action/action.component';
import { TaskCalendarComponent } from '../task-calendar/task-calendar.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public doughnutChartLabels = ['OPEN', 'COMPLETE', 'OVERDUE', 'CLOSED'];
  public initialData = [0, 0, 0, 0];
  public doughnutChartData = new Array<number>();
  public doughnutChartType:string = 'doughnut';
  public doughnutChartColors: any[] = [{ backgroundColor: ["#4FC3F7", "#4DB6AC", "#E57373", "#E0E0E0"]}];
  public doughnutChartOptions:any = {
    responsive: true,
    legend: false
  }

  public barChartLabels:string[] = [];
  public barChartType:string = 'bar';
  public barChartLegend:boolean = true;
  public barChartOptions:any = {
    scaleShowVerticalLines: false,
    responsive: true,
    scales: {
      yAxes: [{ticks: {min: 0}}]
    }
  };
  public barChartData = [
    {data: [], label: 'OPEN'},
    {data: [], label: 'COMPLETE'},
    {data: [], label: 'OVERDUE'}
  ];
  public myColors= [{backgroundColor: '#4FC3F7'}, { backgroundColor: '#4DB6AC'}, { backgroundColor: '#E57373'}];

  outstandingTasks = new Array<any>();
  myTasks = new Array<any>();

  constructor(
    public potService: PotService,
    private userService: UserService,
    public dialog: MatDialog,
    public route: ActivatedRoute,
    public router: Router,
  ) { }

  ngOnInit() {
    this.potService.getOutstandingTasks(this.userService.getUserName()).subscribe(res => {
      this.outstandingTasks = res;
    })
    this.potService.getMyTasks(this.userService.getUserID()).subscribe(res => {
      this.myTasks = res;
    })
    this.potService.getAllTasks(this.userService.getUserName()).subscribe(res => {
      for (var item of res) {
        for (var i in this.doughnutChartLabels) {
          if (item.status == this.doughnutChartLabels[i]) {
            this.initialData[i] = item.total;
          }
        }
      }
      this.doughnutChartData = this.initialData;
    })
    this.potService.getTasksByUser(this.userService.getUserName()).subscribe(res => {
      var flags = [], uniqueNames = [], uniqueStatus = [], l = res.length, i;
      for( i=0; i<l; i++) {
          if( flags[res[i].firstName]) continue;
          flags[res[i].firstName] = true;
          uniqueNames.push(res[i].firstName);
      }
      // for( i=0; i<l; i++) {
      //   if( flags[res[i].status]) continue;
      //   flags[res[i].status] = true;
      //   uniqueStatus.push(res[i].status);
      // }
      var chartDataArray = new Array<any>();
      for (var n in this.barChartData) {
        var chartData = {data: [], label: this.barChartData[n].label}
        for (var m in uniqueNames) {
          var match = res.filter(x => x.status == this.barChartData[n].label && x.firstName == uniqueNames[m]);
          if (match[0]) {
            chartData.data[m] = match[0].total;
          } else {
            chartData.data[m] = 0;
          }
        }
        chartDataArray.push(chartData);
      }      
      this.barChartLabels.length = 0;
      for (var name of uniqueNames) {
        this.barChartLabels.push(name);
      }
      this.barChartLabels = uniqueNames;
      this.barChartData = chartDataArray;
    })
  }

  public chartClicked(e:any):void {
    var index = e.active[0]._index;
    var status = '';
    if (index == 0) {
      status = 'open';
    } else if (index == 1) {
      status = 'complete';
    } else if (index == 2) {
      status = 'overdue';
    } else {
      status = 'closed';
    }
    this.router.navigate(['/task-calendar/' + status])
  }

  barChartClicked(e) {
    if(e.active[0]) {
      console.log(e.active[0]._model.label);
      var name = e.active[0]._model.label
      this.router.navigate(['/task-calendar/' + name])
    }
  }
 
  public chartHovered(e:any):void {
    console.log(e);
  }

  openActionTask(id) {
    let dialogRef = this.dialog.open(ActionComponent, {
      data: {actionTaskID: id}
    });

    dialogRef.afterClosed().subscribe(res => {
      this.ngOnInit();
    });
  }
}
