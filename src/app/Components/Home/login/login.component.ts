import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';

import { LoginService } from "src/app/Servicios/login.service";
import { UserService } from "src/app/Servicios/user.service";
import { User } from 'src/app/Modelos/user';
import { RelojService } from 'src/app/Servicios/reloj.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  mensaje: String;
  userLogged: User;

  formGroup= new FormGroup({
    idUser: new FormControl(''),
    password: new FormControl('')
  });

  //Temporizadores
  private r1Subsciption;

  constructor(private _formBuilder: FormBuilder,
    private router: Router,
    private loginService: LoginService,
    private userService: UserService,
    private reloj: RelojService
    ) { 
      
      this.r1Subsciption = this.reloj.timeSecondSession.subscribe((now: Date) => {
        //console.log("Estamos aqui")
        this.userLogged = this.userService.getUserLoggedIn();
        if (this.userLogged) {
          this.router.navigateByUrl('/moga');
        }
      });
    }

  ngOnInit() {
    this.formGroup = this._formBuilder.group({
      idUser: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.userLogged = this.userService.getUserLoggedIn();
    if (this.userLogged) {
      this.router.navigateByUrl('/moga');
    }
  }

  ngOnDestroy(): void {
    this.r1Subsciption.unsubscribe();
  }

  login(){
    console.log("Hola mundo");
    if (this.formGroup.valid) {
      this.loginService.getAdmin(this.formGroup.get('idUser').value,this.formGroup.get('password').value)
        .subscribe(res => {
          console.log(res);
          if (res[0]) {
            //console.log(res[0]);
            let u: User = {username: res[0]['_id']};;        
              this.userService.setUserLoggedIn(u);
              this.router.navigateByUrl('/moga');
              this.mensaje = null;  
          }else{
            //console.log("Usuario o contraseña incorrectos.");
            this.mensaje = "Usuario o contraseña incorrectos.";
          }
          
        });
    }else{
      this.mensaje = "Campos vacíos.";
    }
  }

}
