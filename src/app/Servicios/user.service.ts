import { Injectable } from '@angular/core';
import { User } from "src/app/Modelos/user";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private isUserLoggedIn;
  public usserLogged:User;

  constructor() { 
  	this.isUserLoggedIn = false;
  }

  setUserLoggedIn(user:User) {
    this.isUserLoggedIn = true;
    this.usserLogged = user;
    localStorage.setItem('currentUserMogaRegister', JSON.stringify(user));
    
  }

  getUserLoggedIn() {
  	return JSON.parse(localStorage.getItem('currentUserMogaRegister'));
  }

  closeSession(){
    localStorage.removeItem('currentUserMogaRegister');
  }
}
