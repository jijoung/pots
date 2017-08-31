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
import { PaginationModule } from 'ng2-bootstrap';
import { RAPFrameworkModule } from './rap-table/framework.module'
import { CalendarModule } from 'angular-calendar';

import { PotService } from './pot.service';
import { UserService } from './user.service';
import { AuthGuard } from './auth.guard';

import { AppComponent } from './app.component';
import { TaskFormComponent } from './task-form/task-form.component';
import { TaskListComponent } from './task-list/task-list.component';
import { ActionComponent } from './action/action.component';
import { LoginComponent } from './login/login.component';
import { ActionListComponent } from './action-list/action-list.component';
import { TaskCalendarComponent } from './task-calendar/task-calendar.component';

@NgModule({
  declarations: [
    AppComponent,
    TaskFormComponent,
    TaskListComponent,
    ActionComponent,
    LoginComponent,
    ActionListComponent,
    TaskCalendarComponent,
  ],
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
    PaginationModule.forRoot(),
    RAPFrameworkModule,
    CalendarModule.forRoot()
  ],
  providers: [PotService, UserService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
