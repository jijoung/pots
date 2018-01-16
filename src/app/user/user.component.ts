import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {FormControl, Validators} from '@angular/forms';
import { PotService } from '../pot.service';
import { UserService } from '../user.service';
import { ColumnOptions } from '../rap-table/ColumnOptions';
import { User } from '../model/user';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  isAdmin:boolean;
  columnSettings: Array<ColumnOptions>; 
  userData:Array<any>;
  domains:Array<any>;
  roles:Array<any>;
  user:User;
  domainID:string;
  step = 1;

  selectedDomain: number;
  selectedRole: number;

  emailFormControl = new FormControl('', [
    Validators.pattern(EMAIL_REGEX)]);

  constructor(
    public potSerivce:PotService,
    private userService:UserService,
    public route: ActivatedRoute,
    public router: Router
  ) { }

  ngOnInit() {
    this.isAdmin = (this.userService.getUserRole() == "1")
    this.domainID = this.userService.getUserDomain();
    if (this.isAdmin) {
      this.columnSettings = [
        {attribute:"userName" , header:"Username"}, 
        {attribute:"lastName" , header:"LastName"},
        {attribute:"firstName", header:"FirstName"},
        {attribute:"status" , header:"Status"},
        {attribute:"domain" , header:"Domain"},
        {attribute:"role" , header:"Role"}
      ]  
      this.potSerivce.potsGetUsers(this.domainID).subscribe(res => {
        this.userData = res;
      })
      this.potSerivce.getFilters(this.userService.getUserName()).subscribe(res => {
        this.domains = res.domains;
        this.roles = res.roles;
      })
    } else {
      this.router.navigate(['/login']);
    }

  }

  setStep(index: number) {
    this.step = index;
  }

  addUser(e) {
    if (e.userName && e.firstName && e.lastName && e.roleID) {
      e.domainID = this.domainID;
      e.email = this.emailFormControl.value
      this.user = e;
      console.log(this.user);
      this.step++;
      this.potSerivce.InsertUser(this.user).subscribe(res => {
        this.potSerivce.potsGetUsers(this.domainID).subscribe(result => {
          this.userData = result;
        })
      })
    } else {
      alert('Please fill out required fields');
    }
  }
}
