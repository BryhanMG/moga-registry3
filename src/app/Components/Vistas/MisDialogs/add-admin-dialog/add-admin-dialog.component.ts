import { Component, OnInit, Inject } from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';

import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AdministradorService } from 'src/app/Servicios/administrador.service';

@Component({
  selector: 'app-add-admin-dialog',
  templateUrl: './add-admin-dialog.component.html',
  styleUrls: ['./add-admin-dialog.component.css']
})
export class AddAdminDialogComponent implements OnInit {
  idUser: String;
  nombres: String;
  rolNombre: String;
  rol: number;

  tipo = "password";

  formGroup= new FormGroup({
    password: new FormControl('')
  });

  constructor(public dialogRef: MatDialogRef<AddAdminDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private adminService: AdministradorService,
    private _formBuilder: FormBuilder,
    ) { }

  ngOnInit() {
    this.idUser = this.data["idUser"];
    this.nombres = this.data["nombres"];
    this.rolNombre = this.data["rolNombre"];
    this.rol = this.data["rol"];
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  ferror = false;
  mensaje: String;
  addAdmin(){
    var pass: String = this.formGroup.get('password').value;
    if (this.formGroup.valid && pass.length > 4) {
      this.adminService.postAdministrador({
        _id: this.idUser,
        password: pass
      }).subscribe(res => {
        console.log(res);
        this.dialogRef.close(true);
      });
    }else{
      this.mensaje = "* Password debe ser, al menos, de 5 caracteres."
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
