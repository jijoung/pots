import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../auth.guard'

import { TaskFormComponent } from '../task-form/task-form.component';
import { TaskListComponent } from '../task-list/task-list.component';
import { ActionComponent } from '../action/action.component';
import { LoginComponent } from '../login/login.component';
import { TaskCalendarComponent } from '../task-calendar/task-calendar.component';
import { HomeComponent } from '../home/home.component';
import { FileComponent } from '../file/file.component';
import { EditComponent } from '../edit/edit.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { UserComponent } from '../user/user.component';
import { FieldComponent } from '../field/field.component';
import { FeedbackComponent } from '../feedback/feedback.component';
import { TimelineComponent } from '../timeline/timeline.component';
import { AssignmentComponent } from '../assignment/assignment.component';
import { TemplateComponent } from '../template/template.component';
import { PortfolioComponent } from '../portfolio/portfolio.component';

// canActivate: [AuthGuard],
const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'feedback', component: FeedbackComponent },
  { path: 'task-form', canActivate: [AuthGuard], component: TaskFormComponent },
  { path: 'task-list', canActivate: [AuthGuard], component: TaskListComponent },
  { path: 'action/:id', canActivate: [AuthGuard], component: ActionComponent },
  { path: 'task-calendar', canActivate: [AuthGuard], component: TaskCalendarComponent },
  { path: 'task-calendar/:status', canActivate: [AuthGuard], component: TaskCalendarComponent },
  { path: 'task-calendar/:name', canActivate: [AuthGuard], component: TaskCalendarComponent },
  { path: 'file', canActivate: [AuthGuard], component: FileComponent },
  { path: 'edit/:id', canActivate: [AuthGuard], component: EditComponent },
  { path: 'user', canActivate: [AuthGuard], component: UserComponent},
  { path: 'field', canActivate: [AuthGuard], component: FieldComponent},
  { path: 'dashboard', canActivate: [AuthGuard], component: DashboardComponent},
  { path: 'timeline', canActivate: [AuthGuard], component: TimelineComponent},
  { path: 'assignment', canActivate: [AuthGuard], component: AssignmentComponent},
  { path: 'template', canActivate: [AuthGuard], component: TemplateComponent},
  { path: 'portfolio', canActivate: [AuthGuard], component: PortfolioComponent}
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
