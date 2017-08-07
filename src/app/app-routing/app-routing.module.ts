import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { TaskFormComponent } from '../task-form/task-form.component';

const routes: Routes = [
  { path: '', redirectTo: '/task-form', pathMatch: 'full' },
  { path: 'task-form', component: TaskFormComponent}
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
