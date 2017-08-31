import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';
import { FormControl, Validators } from '@angular/forms';
import { PotService } from '../pot.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  inputID: string;
  inputPassword: string;

  isUserExist: boolean;

  idFormControl = new FormControl('', [
    Validators.required
  ]);

  passwordFormControl = new FormControl('', [
    Validators.required
  ])

  constructor(
    public potService: PotService,
    public route: ActivatedRoute,
    public router: Router,
    private user: UserService
  ) { }

  ngOnInit() {}

  CheckUser() {
    this.potService.potsIsUserExist(this.inputID).do(res => this.LoginUser(res)).subscribe()
  }

  LoginUser(user) {
    this.isUserExist = user;
    if (this.isUserExist){
      this.user.setUserLoggedIn();
      this.user.setUserName(this.inputID);
      this.router.navigate(['/task-list']);
    } else {
      alert("Wrong ID or Password. Please try again.");
    } 
  }

}
