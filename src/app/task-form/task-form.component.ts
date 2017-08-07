import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

const NUMBER_REGEX = /^(0?[0-9]?[0-9]|1[0-4][0-9]|15[0])$/;

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit {
  selectedDepartment: number;
  selectedCategory: number;
  selectedProcedure: number;
  selectedUser: number;
  selectedOwner: number;
  selectedStatus = 0;
  selectedPerformer: number;
  selectedApprover: number;
  selectedFrequency: number;

  // departmentSelected = false;

  departments = [
    {value: 0, viewValue: 'Financing Compliance'}
  ];

  categories = [
    {value: 0, viewValue: 'Investor Communication'},
    {value: 1, viewValue: 'Office Matters'},
    {value: 2, viewValue: 'Human Resources'},
    {value: 3, viewValue: 'Portfolio Reporting'},
    {value: 4, viewValue: 'ABPCI Direct Lending Funding IV LLC'},
    {value: 5, viewValue: 'ABPCI Direct Lending Funding III LLC'},
    {value: 6, viewValue: 'SMA Requirements'},
    {value: 7, viewValue: 'Internal Communication'},
    {value: 8, viewValue: 'Potential Investor Presentation'},
    {value: 9, viewValue: 'BDC Requirements'},
  ];

  procedures = [
    {value: 0, viewValue: 'Procedure1'},
    {value: 1, viewValue: 'Procedure2'},
    {value: 2, viewValue: 'Procedure3'}
  ];

  users = [
    {value: 0, viewValue: 'Briana Finkelstein'},
    {value: 1, viewValue: 'Christopher Terry'},
    {value: 2, viewValue: 'Liz Pyeatt'},
    {value: 3, viewValue: 'Nicole Della Cava'},
    {value: 4, viewValue: 'Roy Castromonte'},
    {value: 5, viewValue: 'Virginia Kocher'},
    {value: 6, viewValue: 'Wesley Raper'},
  ];

  owners = [
    {value: 0, viewValue: 'Briana Finkelstein'},
    {value: 1, viewValue: 'Christopher Terry'},
    {value: 3, viewValue: 'Nicole Della Cava'},
    {value: 4, viewValue: 'Roy Castromonte'},
    {value: 5, viewValue: 'Virginia Kocher'},
    {value: 6, viewValue: 'Wesley Raper'},
  ];

  statuses = [
    {value: 0, viewValue: 'Open'},
    {value: 1, viewValue: 'Close'}
  ];

  performers = [
    {value: 0, viewValue: 'Briana Finkelstein'},
    {value: 1, viewValue: 'Christopher Terry'},
    {value: 3, viewValue: 'Nicole Della Cava'},
    {value: 4, viewValue: 'Roy Castromonte'},
    {value: 5, viewValue: 'Virginia Kocher'},
    {value: 6, viewValue: 'Wesley Raper'},
  ];

  approvers = [
    {value: 0, viewValue: 'Briana Finkelstein'},
    {value: 1, viewValue: 'Christopher Terry'},
    {value: 3, viewValue: 'Nicole Della Cava'},
    {value: 4, viewValue: 'Roy Castromonte'},
    {value: 5, viewValue: 'Virginia Kocher'},
    {value: 6, viewValue: 'Wesley Raper'},
  ];

  frequencies = [
    {value: 0, viewValue: 'One Time'},
    {value: 1, viewValue: 'Daily'},
    {value: 2, viewValue: 'Weekly'},
    {value: 3, viewValue: 'Biweekly'},
    {value: 4, viewValue: 'Monthly'},
    {value: 5, viewValue: 'Quarterly'},
    {value: 3, viewValue: 'Yearly'},
  ];

  constructor() { }

  frequencyFormControl = new FormControl('', [
    Validators.pattern(NUMBER_REGEX)
  ]);

  ngOnInit() {
    (<HTMLElement>document.getElementById('item-2')).style.display = 'none';
  }

  checkDepartment() {
    (<HTMLElement>document.getElementById('item-2')).style.display = '';
  }

}
