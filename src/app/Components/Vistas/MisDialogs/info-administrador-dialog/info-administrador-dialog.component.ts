import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';

import { AdministradorService } from 'src/app/Servicios/administrador.service';
import { Administrador } from 'src/app/Modelos/administrador';
import { RegistroService } from 'src/app/Servicios/registro.service';
import { EventoRegistro } from 'src/app/Modelos/eventoRegistro';
import { EliminarEventoDialogComponent } from '../eliminar-evento-dialog/eliminar-evento-dialog.component';

@Component({
  selector: 'app-info-administrador-dialog',
  templateUrl: './info-administrador-dialog.component.html',
  styleUrls: ['./info-administrador-dialog.component.css']
})
export class InfoAdministradorDialogComponent implements OnInit {
  idUser: String;
  nombres: String;
  rol: String;
  idRol: number;
  eventosID: [];
  eventos: any[];

  tipo = "password";

  formGroup= new FormGroup({
    password: new FormControl('')
  });

  constructor(public dialogRef: MatDialogRef<InfoAdministradorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private eventoService: RegistroService,
    private administradorService: AdministradorService,
    public dialog: MatDialog,
    private _formBuilder: FormBuilder,
    ) { }

  ngOnInit() {
    this.idUser = this.data["idUser"];
    this.nombres = this.data["nombres"];
    this.rol = this.data["rol"];
    this.eventosID = this.data["eventos"];
    this.idRol = this.data["idRol"];
    //console.log(this.idRol);
    if (this.idRol == 2) {
      this.obtenerEventos();  
    }
    this.formGroup = this._formBuilder.group({
      password: ['', Validators.required]
    }); 
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  obtenerEventos(){
    this.eventos = [];
    for (const id of this.eventosID) {
      this.eventoService.getEvento(id)
        .subscribe(res => {
          const ev = res as EventoRegistro;
          this.eventos.push(ev);
          //console.log(this.eventos);
        });
        
    }
    
  }

  //Dialog para eliminar a un evento de un administrador
  EliminarDialog(id: String, nom: String): void {
    const dialogRef = this.dialog.open(EliminarEventoDialogComponent, {
      data: {idEvento: id, nombre: nom}
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log(result);
      console.log('The dialog was closed');
      if (result) {
        this.eliminarEvento(id);
      }
    });
  }

  eliminarEvento(id: String){
    var lista = [];
    for (const evento of this.eventosID) {
      if(evento != id){
        lista.push(evento);
      }
    }
    //console.log(lista);
    var admin= new Administrador();
    admin._id = this.idUser;
    admin.eventos = lista as [];
    //console.log(admin);
    this.administradorService.updateAdminEventos(admin)
      .subscribe(res => {
        //console.log(res);
        for (let i = 0; i < this.eventos.length; i++) {
          if (this.eventos[i]._id === id) {
            //console.log("Encontrado");
            this.eventos.splice(i,1);
          }
        }
      });
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
