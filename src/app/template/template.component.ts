import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PotService } from '../pot.service';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router } from '@angular/router';
import * as FileSaver from 'file-saver';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.css']
})
export class TemplateComponent implements OnInit {

  templateForm: FormGroup;
  issuers:Array<any>;
  filteredIssuers: Observable<any[]>;
  file: File;
  fundingMemo: File;
  fileSubscription: Subscription;
  constructor(
    public potService: PotService,
    private fb: FormBuilder,
    public route: ActivatedRoute,
    public router: Router,
  ) { 
    this.createForm();
  }

  ngOnInit() {
    this.potService.getIssuers().subscribe(res => {
      //console.log(res);
      this.issuers = res;
      this.filteredIssuers = this.templateForm.get('issuer').valueChanges.startWith(null)
        .map(val => val ? this.filterIssuers(val) : this.issuers.slice());
    });
  }

  createForm() {
    this.templateForm = this.fb.group({
      issuer: ['', Validators.required]
    })
  }

  displayIssuer(issuer: any): string {
    return issuer ? issuer.name : "";
  }

  filterIssuers(name: string): any[] {
    return this.issuers.filter(issuer => new RegExp(`^${name}`, 'gi')
    .test(issuer.name));
  }

  fileChange(e) {
    this.file = e.target.files[0];
  }
  fundingMemoChange(e) {
    this.fundingMemo = e.target.files[0];
  }
  addTemplate() {
    let issuer = this.templateForm.value.issuer;
    if (this.templateForm.valid && this.file != undefined) {
      let formData = new FormData();
      formData.append('file', this.file);
      this.potService.uploadAssignmentTemplate(issuer.issuerID, issuer.name, formData).subscribe(res => {
        this.router.navigate(['/assignment']);
      });
    } else {
      alert('Please enter an issuer and choose a template');
    }
  }
  updateFundingMemo() {
    if (this.fundingMemo != undefined) {
      let formData = new FormData();
      formData.append('file', this.fundingMemo);
      this.potService.uploadFundingMemoTemplate(formData).subscribe(res => {
        this.router.navigate(['/assignment']);
      });
    }
  }
  download() {
    let issuer = this.templateForm.value.issuer;
    if(issuer.templatePath) {
      console.log(issuer.templatePath);
      this.fileSubscription = this.potService.getFile(issuer.templatePath).subscribe(file => {
        FileSaver.saveAs(file, issuer.name);
        this.ngOnInit();
      });
      //test.unsubscribe();
    } else {
      alert('Selected issuer does not have a template');
    }
  }
  downloadFundingMemo() {
    var fundingMemoPath = '\\\\nts0018\\Bond\\POTS\\FundingMemo\\Funding Memo Template.xlsx';
    this.potService.getFile(fundingMemoPath).subscribe(file => {
      FileSaver.saveAs(file, 'Funding Memo Template');
    });
  }
}
