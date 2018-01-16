import { Injectable } from '@angular/core';

@Injectable()
export class UserService {

  private isUserLoggedIn;
  private username;

  constructor() {
    this.isUserLoggedIn = false;
  }

  setUserLoggedIn() {
    this.isUserLoggedIn = true;
  }

  setUserLoggedOut() {
    this.isUserLoggedIn = false;
  }

  getUserLoggedIn() {
    var storageUser = window.window.localStorage.getItem('user');
    if(storageUser) {
      this.isUserLoggedIn = true;
    }
    return this.isUserLoggedIn;
  }

  getUserRole() {
    return window.window.localStorage.getItem('role');
  }

  getUserDomain() {
    return window.window.localStorage.getItem('domain');
  }

  getUserID() {
    return window.window.localStorage.getItem('ID');
  }

  getUserEmail() {
    return window.window.localStorage.getItem('email');
  }

  getUserPhone() {
    return window.window.localStorage.getItem('phone');
  }

  getUserFullName() {
    return window.window.localStorage.getItem('name');
  }

  getSignature() {
    return window.window.localStorage.getItem('signature');
  }

  setUserName(username) {
    this.username = username;
  } 

  getUserName() {
    var storageUser = window.window.localStorage.getItem('user');
    if(storageUser) {
      this.username = storageUser;
    }
    return this.username;
  }
}
