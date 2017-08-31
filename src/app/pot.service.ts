import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

@Injectable()
export class PotService {

  local_api_url = 'http://localhost:50008/api/pots/';
  api_url = 'http://rapdev:9119/api/pots/'

  constructor(private _http: Http) { }

  potsGetUsers() {
    return this._http.get(this.api_url + 'GetAllUsers').map(res => res.json());
  }

  potsGetDepartments() {
    return this._http.get(this.api_url + 'GetDepartments').map(res => res.json());
  }

  potsGetCategories() {
    return this._http.get(this.api_url + 'GetCategories').map(res => res.json());
  }

  potsGetFrequencies() {
    return this._http.get(this.api_url + 'GetFrequencies').map(res => res.json());
  }

  potsGetStatuses() {
    return this._http.get(this.api_url + 'GetTaskStatuses').map(res => res.json());
  }

  potsGetUserByDepartment(departmentId) {
    return this._http.get(this.api_url + 'GetUserByDepartment?departmentId=' + departmentId).map(res => res.json());
  }

  potsGetTasks(username) {
    return this._http.get(this.api_url + 'GetUserTasks?username=' + username).map(res => res.json());
  }

  potsGetTaskById(id) {
    return this._http.get(this.api_url + 'GetTaskById?taskId=' + id).map(res => res.json());
  }

  potsIsUserExist(username) {
    return this._http.get(this.api_url + 'IsUserExist?username=' + username).map(res => res.json());
  }

  potsGetFilteredTasks(departments, categories, frequencies, statuses, fromdate, todate) {
    return this._http.get(this.api_url + 'GetFilteredTask?departmentList=' + departments + 
      '&categoryList=' + categories + '&frequencyList=' + frequencies + '&statusList=' + statuses 
      + '&fromDate=' + fromdate + '&toDate=' + todate).map(res => res.json());
  }

  potsGetCalendarTasks(username, departments?, categories?, frequencies?, statuses?, userid?) {
    return this._http.get(this.api_url + 'GetCalendarTask?userName=' + username + '&departmentList=' 
      + departments + '&categoryList=' + categories + '&frequencyList=' + frequencies + '&statusList='
      + statuses + '&userId=' + userid).map(res => res.json());
  }

  potsAddTask(data) {
    return this._http.post(this.api_url + 'InsertTask', data).map(() => '');
  }  

  potsUpdateTaskState(data) {
    return this._http.post(this.api_url + 'UpdateTaskState', data).map(() => '');
  }

  potsUpdateTaskStatus(data) {
    return this._http.post(this.api_url + 'UpdateTaskStatus', data).map(() => '');
  }
}
