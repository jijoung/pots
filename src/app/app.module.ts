import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { AngularMaterialModule } from './angular-material/angular-material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import 'hammerjs';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2TableModule } from 'ng2-table/ng2-table';
// import { PaginationModule } from 'ng2-bootstrap';
import { RAPFrameworkModule } from './rap-table/framework.module'
import { CalendarModule } from 'angular-calendar';
import { ChartsModule } from 'ng2-charts/ng2-charts';
// import { MomentModule } from 'angular2-moment';

import { PotService } from './pot.service';
import { UserService } from './user.service';
import { AuthGuard } from './auth.guard';
import { DateService } from './date.service';

import { AppComponent } from './app.component';
import { TaskFormComponent } from './task-form/task-form.component';
import { TaskListComponent } from './task-list/task-list.component';
import { ActionComponent } from './action/action.component';
import { LoginComponent } from './login/login.component';
import { ActionListComponent } from './action-list/action-list.component';
import { TaskCalendarComponent } from './task-calendar/task-calendar.component';
import { FileComponent } from './file/file.component';
import { HomeComponent } from './home/home.component';
import { EditComponent } from './edit/edit.component';

import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { SubtaskComponent } from './subtask/subtask.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserComponent } from './user/user.component';
import { FieldComponent } from './field/field.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { TaskSelectComponent } from './task-select/task-select.component';
import { TimelineComponent } from './timeline/timeline.component';
import { AssignmentComponent } from './assignment/assignment.component';
import { TemplateComponent } from './template/template.component';
import { LoadingComponent } from './loading/loading.component';
import { PortfolioComponent } from './portfolio/portfolio.component';

@NgModule({
  declarations: [
    AppComponent,
    TaskFormComponent,
    TaskListComponent,
    ActionComponent,
    LoginComponent,
    ActionListComponent,
    TaskCalendarComponent,
    FileComponent,
    HomeComponent,
    EditComponent,
    SubtaskComponent,
    DashboardComponent,
    UserComponent,
    FieldComponent,
    FeedbackComponent,
    TaskSelectComponent,
    TimelineComponent,
    AssignmentComponent,
    TemplateComponent,
    LoadingComponent,
    PortfolioComponent
  ],
  entryComponents: [TaskSelectComponent, LoadingComponent],
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    FlexLayoutModule,
    Ng2TableModule,
    // PaginationModule.forRoot(),
    RAPFrameworkModule,
    CalendarModule.forRoot(),
    ChartsModule
    // MomentModule,
  ],
  providers: [PotService, UserService, AuthGuard, DateService, {provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }
