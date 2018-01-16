import { Component, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { TaskFormComponent } from '../task-form/task-form.component';
import { PotService } from '../pot.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {

  colors=[
    {name:"mat-button-toggle-1", color:""},
    {name:"mat-button-toggle-2", color:""},
    {name:"mat-button-toggle-3", color:""},
    {name:"mat-button-toggle-4", color:""},
    {name:"mat-button-toggle-5", color:""}
  ];

  sentiment:string;
  message:string;

  constructor(
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    public potService: PotService
  ) { }

  ngOnInit() {
  }

  select(e) {
    for (var item of this.colors) {
      if (e.selected.id == item.name) {
        item.color = "primary";
      } else {
        item.color = "";
      }
    }
  }
  
  submitFeedback(e) {
    console.log(e);
    this.potService.submitFeedback(e).subscribe();
    this.sentiment = undefined;
    this.message = undefined;
    for (var item of this.colors) {
      item.color="";
    }
    this.snackBar.open('Thanks for submitting your feedback!', 'Close', {
      duration: 2000,
    });
  }
}