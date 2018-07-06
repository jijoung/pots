import { Component, ViewChild, Compiler } from '@angular/core';
import { UserService } from './user.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'app';
  username: string;
  isUserLoggedIn: boolean;
  isAdmin: boolean;
  isTaskModule: boolean;
  isAutomationModule: boolean;
  isAdminModule: boolean;
  isFeedbackModule: boolean;

  @ViewChild('modulenav') public moduleNav: any;

  constructor(
    private user: UserService,
    public route: ActivatedRoute,
    public router: Router,
    private _compiler: Compiler
  ) { 
    this.isUserLoggedIn = user.getUserLoggedIn();
    this.isTaskModule = (window.window.localStorage.getItem('module') == '1');
    this.isAdminModule = (window.window.localStorage.getItem('module') == '2');
    this.isFeedbackModule = (window.window.localStorage.getItem('module') == '3');
    this.isAutomationModule = (window.window.localStorage.getItem('module') == '4');
    this.isAdmin = (window.window.localStorage.getItem('role') == '1');
    this.username = user.getUserName();
  }

  login() {
    this.isUserLoggedIn = true;
  }

  logout() {
    this.user.setUserLoggedOut();
    window.window.localStorage.clear();
    this.isUserLoggedIn = false;
    this.isAdminModule = false;
    this.isTaskModule = false;
    this.isFeedbackModule = false;
    this.isAutomationModule = false;
    this.isAdmin = false;
    this._compiler.clearCache();
    // location.reload();
  }

  openTaskModule() {
    if (this.user.getUserLoggedIn()) {
      this.isTaskModule = true;      
      this.isAdminModule = false;
      this.isFeedbackModule = false;
      this.isAutomationModule = false;
      window.window.localStorage.setItem('module', '1');
      //window.window.localStorage.setItem('fileMoudle', '2');
      this.router.navigate(['/dashboard']);
    } else {
      alert("Please login to launch the module");
    }
  }
  
  openAutomationModule() {
    if (this.user.getUserLoggedIn()) {
      this.isTaskModule = false;      
      this.isAdminModule = false;
      this.isFeedbackModule = false;
      this.isAutomationModule = true;
      window.window.localStorage.setItem('module', '4');
      //window.window.localStorage.setItem('fileMoudle', '2');
      this.router.navigate(['/assignment']);
    } else {
      alert("Please login to launch the module");
    }
  }


  openAdminModule() {
    if (this.user.getUserLoggedIn()) {
      this.isAdminModule = true;
      this.isTaskModule = false;
      this.isFeedbackModule = false;
      this.isAutomationModule = false;
      window.window.localStorage.setItem('module', '2');
      this.router.navigate(['/user']);
    } else {
      alert("Please login to launch the module");
    }
  }

  openFeedbackModule() {
    this.isFeedbackModule = true;
    this.isAdminModule = false;
    this.isTaskModule = false;
    this.isAutomationModule = false;
    window.window.localStorage.setItem('module', '3');
    this.router.navigate(['/feedback']);
  }
}
