import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import { SubTask } from '../model/task';

@Component({
  selector: 'app-subtask',
  templateUrl: './subtask.component.html',
  styleUrls: ['./subtask.component.css']
})
export class SubtaskComponent implements OnInit {

  @Input() subtaskCount:number;
  @Input() subtaskInput:any;
  @Input() minDate: Date;
  @Input() maxDate: Date;
  @Input() isEdit: boolean;
  @Output() subtask:EventEmitter<SubTask> = new EventEmitter();

  added:boolean;
  max = 100;

  subtaskForm = new FormGroup({
    subtaskId: new FormControl(),
    title: new FormControl('', Validators.required),
    description: new FormControl('',Validators.required),
    targetDate: new FormControl(undefined,Validators.required),
    remind: new FormControl('',Validators.max(this.max))
  });

  constructor() { }

  ngOnInit() {
    if (this.subtaskInput) {
      this.subtaskForm.get('title').setValue(this.subtaskInput.title);
      this.subtaskForm.get('description').setValue(this.subtaskInput.description);
      this.subtaskForm.get('targetDate').setValue(this.subtaskInput.targetDate);
      this.subtaskForm.get('remind').setValue(this.subtaskInput.remind);
      if (this.isEdit) {
        this.subtaskForm.get('title').disable();
      }
    }
  }

  addSubTask() {
    this.subtaskForm.get('subtaskId').setValue(this.subtaskCount);
    if(!this.subtaskForm.get('remind').value) {
      if(this.subtaskForm.get('title').valid && this.subtaskForm.get('description').valid 
        && this.subtaskForm.get('targetDate').valid) {    
        this.added = true;
        this.subtask.emit(this.subtaskForm.value);
      } else {
        alert('Invalid')
      }
    } else if (this.subtaskForm.valid) {
      this.added = true;
      this.subtask.emit(this.subtaskForm.value);
    } else {
      alert('Invalid')
    }
  }

  editSubTask() {
    console.log("Implement Subtask Edit");
    console.log(this.subtaskForm.value);
  }
}
