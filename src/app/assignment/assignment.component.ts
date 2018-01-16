import { Component, OnInit } from '@angular/core';
import {FormControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import { User } from '../model/user';
import { PotService } from '../pot.service';
import { UserService } from '../user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { LoadingComponent } from '../loading/loading.component';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-assignment',
  templateUrl: './assignment.component.html',
  styleUrls: ['./assignment.component.css'],
})
export class AssignmentComponent implements OnInit {

  assignmentForm: FormGroup;
  today = new Date();

  issuers:Array<any>;
  filteredIssuers: Observable<any[]>;
  assets:Array<any>;
  portfolios:Array<any>;

  parAmount: string = '';

  constructor(
    public potService: PotService,
    private user: UserService,
    private fb: FormBuilder,
    public route: ActivatedRoute,
    public router: Router,
    public dialog: MatDialog
  ) { 
    this.createForm();
  }

  createForm() {
    this.assignmentForm = this.fb.group({
      issuer: ['', Validators.required],
      asset: [{value: '', disabled: true}, Validators.required],
      assignor: ['', Validators.required],
      assignee: ['', Validators.required],
      parAmount: ['', Validators.required],
      price: ['', Validators.required],
      tradeDate: [new Date(), Validators.required],
      settleDate: [new Date(), Validators.required],
    })
  }

  ngOnInit() {
    this.potService.getIssuers().subscribe(res => {
      //console.log(res);
      this.issuers = res;
      this.filteredIssuers = this.assignmentForm.get('issuer').valueChanges.startWith(null)
        .map(val => val ? this.filterIssuers(val) : this.issuers.slice());
    });
    this.potService.getPortfolios(this.user.getUserName()).subscribe(res => {
      this.portfolios = Array.from(res);
    })
  }

  displayIssuer(issuer: any): string {
    return issuer ? issuer.name : "";
  }

  filterIssuers(name: string): any[] {
    return this.issuers.filter(issuer => new RegExp(`^${name}`, 'gi')
    .test(issuer.name));
  }

  submitAssignment() {
    //debugger;
    this.dialog.open(LoadingComponent);
    var assignment = this.assignmentForm.value;
    assignment.parAmount = Number(assignment.parAmount.replace(/,/g,''));
    console.log(assignment);
    assignment.emailTo = this.user.getUserEmail();
    assignment.userName = this.user.getUserFullName();
    assignment.signature = this.user.getSignature();
    if (this.assignmentForm.valid) {
      
      if (assignment.issuer.templatePath == "") {
        if (confirm('Assignment template is missing for the selected issuer. Would you like to add one?')) {
          this.router.navigate(['/template']);
        } else {
          this.potService.submitAssignment(assignment).subscribe(res => {
            console.log(res);
            this.dialog.closeAll();
            this.ngOnInit();         
          });
        }
      } else {
        this.potService.submitAssignment(assignment).subscribe(res => {
          console.log(res);
          this.dialog.closeAll();
          this.ngOnInit();
        });
      }
    } else {
      alert('Please enter all the required fields.');
      this.dialog.closeAll();
    }
  }

  populateAsset() {
    //console.log(this.assignmentForm.get('issuer').value.issuerID);
    this.potService.getAssets(this.assignmentForm.get('issuer').value.issuerID).subscribe(res => {
      this.assets = res;
      console.log(this.assets);
    })
    this.assignmentForm.get('asset').enable();
  } 

  onAmountChange(e) {
    var number = Number(e.replace(/,/g,''));
    this.parAmount = number.toString().replace(/./g, function(c, i, a) {
      return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
    });
  }
}
