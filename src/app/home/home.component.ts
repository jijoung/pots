import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '../app.component'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  username: string;

  constructor(
    private user: UserService,
    public route: ActivatedRoute,
    public router: Router,
    public app: AppComponent
  ) { }

  ngOnInit() {
    if (this.user.getUserLoggedIn()){
      this.username = this.user.getUserName();
    }
    else {
      this.router.navigate(['/login']);
    }
  }

  openTaskModule() {
    this.app.isTaskModule = true;
    this.router.navigate(['/task-list']);
  }

}
