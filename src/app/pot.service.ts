import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, ResponseContentType } from '@angular/http';
import { environment } from '../environments/environment';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

@Injectable()
export class PotService {

  api_url = environment.api_url
  headers: Headers;
  options: RequestOptions;
  postOptions :RequestOptions;

  constructor(private _http: Http) {
    this.headers = new Headers({'Content-Type':'application/json'});
    this.options = new RequestOptions({ withCredentials: true });
    this.postOptions = new RequestOptions({ headers: this.headers, withCredentials: true });
  }

  potsGetUsers(domainID) {
    return this._http.get(this.api_url + 'GetAllUsers?domainID=' + domainID, this.options).map(res => res.json());
  }

  potsGetDomains() {
    return this._http.get(this.api_url + 'GetDomain', this.options).map(res => res.json());
  }

  potsGetDepartments(username) {
    return this._http.get(this.api_url + 'GetDepartments?username=' + username, this.options).map(res => res.json());
  }

  getCategories(username) {
    return this._http.get(this.api_url + 'GetCategories?username=' + username, this.options).map(res => res.json());
  }

  potsGetFrequencies() {
    return this._http.get(this.api_url + 'GetFrequencies', this.options).map(res => res.json());
  }

  potsGetStatuses() {
    return this._http.get(this.api_url + 'GetTaskStatuses', this.options).map(res => res.json());
  }

  getTaskStates() {
    return this._http.get(this.api_url + 'GetTaskStates', this.options).map(res => res.json());
  }

  potsGetUserByDepartment(departmentId) {
    return this._http.get(this.api_url + 'GetUserByDepartment?departmentId=' + departmentId, this.options).map(res => res.json());
  }

  // potsGetTasks(username) {
  //   return this._http.get(this.api_url + 'GetUserTasks?username=' + username).map(res => res.json());
  // }

  potsGetTaskById(id) {
    return this._http.get(this.api_url + 'GetTaskById?taskId=' + id, this.options).map(res => res.json());
  }

  getTaskInfo(id) {
    return this._http.get(this.api_url + 'GetTaskInfo?taskId=' + id, this.options).map(res => res.json());
  }

  getNotes(taskId) {
    return this._http.get(this.api_url + 'GetNotes?taskId=' + taskId, this.options).map(res => res.json());
  }

  potsIsUserExist(username) {
    return this._http.get(this.api_url + 'IsUserExist?username=' + username, this.options).map(res => res.json());
  }

  potsGetFilteredTasks(username, departments?, categories?, frequencies?, statuses?, fromdate?, todate?) {
    return this._http.get(this.api_url + 'GetFilteredTask?username=' + username 
      + '&departmentList=' + departments + '&categoryList=' + categories + '&frequencyList=' 
      + frequencies + '&statusList=' + statuses + '&fromDate=' + fromdate + '&toDate=' + todate, this.options)
        .map(res => res.json());
  }

  potsGetCalendarTasks(username, departments?, categories?, frequencies?, statuses?, userid?) {
    const full_url = this.api_url + 'GetCalendarTask?userName=' + username + '&departmentList=' 
    + departments + '&categoryList=' + categories + '&frequencyList=' + frequencies + '&statusList='
    + statuses + '&userId=' + userid;
    //console.log(full_url);
    return this._http.get(full_url, this.options).map(res => res.json());
  }

  getLastTask() {
    return this._http.get(this.api_url + 'GetLastTask', this.options).map(res => res.json());
  }

  getSubTasks(id) {
    return this._http.get(this.api_url + 'GetSubTasks?taskID=' + id, this.options).map(res => res.json());
  }

  getUserInfo(username) {
    return this._http.get(this.api_url + 'GetUserInfo?username=' + username, this.options).map(res => res.json());
  }

  getWindowsUserInfo() {
    return this._http.get(this.api_url + 'GetWindowsUserInfo', this.options).map(res => res.json());
  }

  getFilters(username) {
    return this._http.get(this.api_url + 'GetFilters?username=' + username, this.options).map(res => res.json());
  }
  
  getUserName() {
    return this._http.get(this.api_url + 'GetUserName', this.options).map(res => res.json());
  }

  getFileInfo(id) {
    return this._http.get(this.api_url + 'GetFileInfo?taskId=' + id, this.options).map(res => res.json());
  }

  getFile(filePath) {
    let option = this.options
    option.responseType = ResponseContentType.Blob;
    return this._http.get(this.api_url + 'GetFile?filePath=' + filePath, option)
      .map(res => res.blob());
  }

  getColumnSetting(userid, domainid) {
    return this._http.get(this.api_url + 'GetColumnSetting?userid=' + userid + '&domainid=' + domainid, this.options).map(res => res.json());
  }

  getTimelineTask(username, departments?, categories?, frequencies?, statuses?, userid?) {
    const full_url = this.api_url + 'GetTimelineTask?userName=' + username + '&departmentList=' 
    + departments + '&categoryList=' + categories + '&frequencyList=' + frequencies + '&statusList='
    + statuses + '&userId=' + userid;
    return this._http.get(full_url, this.options).map(res => res.json());
  }

  getSubTaskList(taskID) {
    return this._http.get(this.api_url + 'GetSubTaskList?taskID=' + taskID, this.options).map(res => res.json());
  }
  getOutstandingTasks(userName) {
    return this._http.get(this.api_url + 'GetOutstandingTasks?userName=' + userName, this.options).map(res => res.json());
  }
  getMyTasks(userID) {
    return this._http.get(this.api_url + 'GetMyTasks?userID=' + userID, this.options).map(res => res.json());    
  }
  getAllTasks(userName) {
    return this._http.get(this.api_url + 'GetAllTasks?userName=' + userName, this.options).map(res => res.json());    
  }
  getTasksByUser(userName) {
    return this._http.get(this.api_url + 'GetTasksByUser?userName=' + userName, this.options).map(res => res.json());        
  }
  getRepeat() {
    return this._http.get(this.api_url + 'GetRepeat', this.options).map(res => res.json());
  }
  getIssuers() {
    this.options.responseType = ResponseContentType.Json;
    return this._http.get(this.api_url + 'GetIssuers', this.options).map(res => res.json());
  }
  getAssets(issuerId) {
    return this._http.get(this.api_url + 'GetAssets?issuerId=' + issuerId, this.options).map(res => res.json());
  }
  getPortfolios(username) {
    return this._http.get(this.api_url + 'GetPortfolios?username=' + username, this.options).map(res => res.json());
  }
  getCompanies() {
    return this._http.get(this.api_url + 'GetCompanies', this.options).map(res => res.json());
  }
  potsAddTask(data) {
    return this._http.post(this.api_url + 'InsertTask', data, this.postOptions).map(() => '');
  }  
  addSubTask(data) {
    return this._http.post(this.api_url + 'InsertSubTask', data, this.postOptions).map(() => '');
  }

  InsertNotes(data) {
    return this._http.post(this.api_url + 'InsertNotes', data, this.postOptions).map(() => '');
  }

  InsertUser(data) {
    return this._http.post(this.api_url + 'InsertUser', data, this.postOptions).map(() => '');
  }

  InsertDepartment(data) {
    return this._http.post(this.api_url + 'InsertDepartment', data, this.postOptions).map(() => '');
  }

  insertCategory(data) {
    return this._http.post(this.api_url + 'InsertCategory', data, this.postOptions).map(() => '');
  }

  insertColumnSetting(data) {
    return this._http.post(this.api_url + 'InsertColumnSetting', data, this.postOptions).map(() => '');
  }

  insertAuditLog(data) {
    return this._http.post(this.api_url + 'InsertAuditLog', data, this.postOptions).map(() => '');
  }

  insertFund(data) {
    return this._http.post(this.api_url + 'InsertFund', data, this.postOptions).map(() => '');
  }

  DeleteTask(data) {
    return this._http.post(this.api_url + 'DeleteTask', data, this.postOptions).map(() => '');
  }

  DeleteFile(data) {
    return this._http.post(this.api_url + 'RemoveFile', data, this.postOptions).map(() => '');
  }

  DeleteFund(data) {
    return this._http.post(this.api_url + 'DeleteFund', data, this.postOptions).map(() => '');
  }

  updateTaskState(data) {
    return this._http.post(this.api_url + 'UpdateTaskState', data, this.postOptions).map(() => '');
  }

  updateTaskStatus(data) {
    return this._http.post(this.api_url + 'UpdateTaskStatus', data, this.postOptions).map(() => '');
  }

  updateTask(data) {
    return this._http.post(this.api_url + 'UpdateTask', data, this.postOptions).map(() => '');
  }

  uploadFile(id, file) {
    return this._http.post(this.api_url + 'UploadFile?id=' + id, file, this.options).map(() => '');
  }

  uploadAssignmentTemplate(issuerId, issuer, file) {
    return this._http.post(this.api_url + 'UploadAssignmentTemplate?issuerId=' + issuerId 
    + '&issuer=' + issuer , file, this.options).map(() => '');
  }

  uploadFundingMemoTemplate(file) {
    return this._http.post(this.api_url + 'UploadFundingMemoTemplate', file, this.options).map(() => '');
  }

  updateUpdatedTime(data) {
    return this._http.post(this.api_url + 'UpdateDate', data, this.postOptions).map(() => '');
  }

  updateRepeatID(data) {
    return this._http.post(this.api_url + 'UpdateRepeatID', data, this.postOptions).map(() => '');
  }

  updateFund(data) {
    return this._http.post(this.api_url + 'UpdateFund', data, this.postOptions).map(() => '');
  }

  submitFeedback(data) {
    return this._http.post(this.api_url + 'SubmitFeedback', data, this.postOptions).map(() => '');
  }

  sendEmail(data) {
    return this._http.post(this.api_url + 'SendEmail', data, this.postOptions).map(() => '');
  }

  submitAssignment(data) {
    return this._http.post(this.api_url + 'SubmitAssignment', data, this.postOptions).map(res => res.json());
  }
}
