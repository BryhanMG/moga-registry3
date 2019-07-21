import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/Servicios/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error-logout',
  templateUrl: './error-logout.component.html',
  styleUrls: ['./error-logout.component.css']
})
export class ErrorLogoutComponent implements OnInit {

  constructor(private userService: UserService,
    private router: Router
    ) { 
    if (this.userService.getUserLoggedIn()) {
      this.router.navigateByUrl('/moga');
    }
  }

  ngOnInit() {

  }

}
