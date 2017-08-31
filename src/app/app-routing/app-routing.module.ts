import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../auth.guard'

import { TaskFormComponent } from '../task-form/task-form.component';
import { TaskListComponent } from '../task-list/task-list.component';
import { ActionComponent } from '../action/action.component';
import { LoginComponent } from '../login/login.component';
import { TaskCalendarComponent } from '../task-calendar/task-calendar.component'

// canActivate: [AuthGuard],
const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent},
  { path: 'task-form', component: TaskFormComponent},
  { path: 'task-list', component: TaskListComponent},
  { path: 'action/:id', component: ActionComponent},
  { path: 'task-calendar', component: TaskCalendarComponent},
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule { }
