import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';

import { AdministradorService } from 'src/app/Servicios/administrador.service';
import { Administrador } from 'src/app/Modelos/administrador';

@Component({
  selector: 'app-info-administrador-dialog',
  templateUrl: './info-administrador-dialog.component.html',
  styleUrls: ['./info-administrador-dialog.component.css']
})
export class InfoAdministradorDialogComponent implements OnInit {
  idUser: String;
  nombres: String;
  rol: String;
  eventosID: [];
  eventos: any[];

  tipo = "password";

  formGroup= new FormGroup({
    password: new FormControl('')
  });

  constructor(public dialogRef: MatDialogRef<InfoAdministradorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private administradorService: AdministradorService,
    public dialog: MatDialog,
    private _formBuilder: FormBuilder,
    ) { }

  ngOnInit() {
    this.idUser = this.data["idUser"];
    this.nombres = this.data["nombres"];
    this.rol = this.data["rol"];
    this.eventosID = this.data["eventos"];

    this.formGroup = this._formBuilder.group({
      password: ['', Validators.required]
    }); 
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }
  ferror = false;
  mensaje: String;
  restablecer(){
    var pass: String = this.formGroup.get('password').value;
    if (this.formGroup.valid && pass.length > 4) {
      this.ferror = false;
      this.administradorService.putAdministradorPass({
        _id: this.idUser,
        password: pass
      })
        .subscribe(res => {
          console.log(res);
          this.mensaje = "* Se restableció la contraseña."
          this.ferror = true;
          this.formGroup.get("password").setValue("");
          this.fpass = false;
          this.tipo = "password";
        });
    }else{
      this.mensaje = "* Password debe ser de al menos 5 caracteres."
      this.ferror = true;
    }
  }

  fpass = false;
  showHidePassword(){
    this.fpass = !this.fpass;
    if (this.fpass) {
      this.tipo="text";
    }else{
      this.tipo="password";
    }
  }

}
