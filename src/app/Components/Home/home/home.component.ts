import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/Servicios/user.service';
import {Location} from '@angular/common';

import { User } from "src/app/Modelos/user";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  userLogged: UserService;
  constructor(private locacion: Location,
    private userService: UserService) { }

  ngOnInit() {
    this.userLogged = this.userService.getUserLoggedIn();
    if (!this.userLogged) {
      this.locacion.back();
    }
  }

}
