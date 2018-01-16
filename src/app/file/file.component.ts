import { Component, OnInit } from '@angular/core';
import { ColumnOptions } from '../rap-table/ColumnOptions';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.css']
})
export class FileComponent implements OnInit {

  files:Array<any>;

  columnSettings: Array<ColumnOptions> = [
    {attribute:"name" , header:"Name"},
    {attribute:"category", header:"Category"},
    {attribute:"format" , header:"Format"}, 
    {attribute:"createdBy" , header:"Created By"},
    {attribute:"date" , header:"Date"},
  ]  

  constructor() { }

  ngOnInit() {
  }

  test() {
    this.files = [{
      name: "AB_PCI_Pipeline.pdf",
      category: "PCI",
      format: "PDF",
      createdBy: "Jinwoong Joung",
      date: "09/11/2017"
    }, {
      name: "AB_PCI_Pipeline.xlsx",
      category: "PCI",
      format: "Excel",
      createdBy: "Jinwoong Joung",
      date: "09/11/2017"
    }];
  }

}
