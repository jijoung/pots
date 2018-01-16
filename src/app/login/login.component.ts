import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';
import { FormControl, Validators } from '@angular/forms';
import { PotService } from '../pot.service';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  inputID: string;
  inputPassword: string;

  isUserExist: Array<any>;

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
    public app: AppComponent,
    private user: UserService
  ) { }

  ngOnInit() {
    this.potService.getWindowsUserInfo().do(res => this.LoginUser(res)).subscribe();
  }

  CheckUser(id) {
    console.log(id);
    this.potService.getUserInfo(id).do(res => this.LoginUser(res)).subscribe();
  }

  LoginUser(user) {
    if (user.length) {
      if(user[0].userName == 'jjoung') {
        if(confirm('Do you want to continue as jjoung?')) {
          
        } else {
          return;
        }
      }
      //console.log(user);
      window.window.localStorage.setItem('user', user[0].userName);
      window.window.localStorage.setItem('role', user[0].roleID);
      window.window.localStorage.setItem('domain', user[0].domainID);
      window.window.localStorage.setItem('ID', user[0].userID);
      window.window.localStorage.setItem('email', user[0].email);
      window.window.localStorage.setItem('phone', user[0].phone);
      window.window.localStorage.setItem('name', user[0].firstName + ' ' + user[0].lastName);
      window.window.localStorage.setItem('signature', user[0].signature);
      this.user.setUserLoggedIn();
      this.user.setUserName(user[0].userName);
      this.app.username = user[0].userName;
      this.app.isUserLoggedIn = true;
      this.app.isTaskModule = true;
      window.window.localStorage.setItem('module', '1');
      this.router.navigate(['/dashboard']);
      this.app.isAdmin = (user[0].roleID == 1);
    } else {
      var password = prompt("Your Windows ID is not registered to use this application. Please send an email to POTSSupport@alliancebernstein.com or enter an admin password to continue.");
      if (password == 'pots_app123') {

      } else {
        alert('Wrong password');
        this.router.navigate(['/feedback']);
      }
      //this.router.navigate(['/feedback'])
    } 
  }

}
