import { Component, OnInit } from '@angular/core';
import { PotService } from '../pot.service';
import { ColumnOptions } from '../rap-table/ColumnOptions';
import { Test } from './test';

@Component({
  selector: 'app-action-list',
  templateUrl: './action-list.component.html',
  styleUrls: ['./action-list.component.css']
})
export class ActionListComponent implements OnInit {

  columnSettings: Array<ColumnOptions> = [
    {attribute:"category" , header:"Category"},
    {attribute:"title" , header:"Title"}, 
    {attribute:"frequency", header:"Frequency"},
    {attribute:"owner" , header:"Owner"},
    {attribute:"due" , header:"Due date"},
    {attribute:"performed" , header:"Last performed"},
    {attribute:"performer" , header:"Performed By"},
    {attribute:"state" , header:"Status"},
  ]  

  actionData: Array<any>;

  constructor(
    public potService: PotService
  ) { }

  ngOnInit() {
    //this.getActionTasks();
  }

  // public getActionTasks() {
  //   this.potService.getActionTasks().subscribe(res => {
  //     console.log(res.tasks);
  //     this.actionData = res.tasks;
  //   })
  // }
}
