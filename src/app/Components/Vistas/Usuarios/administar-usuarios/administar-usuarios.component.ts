import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';

import { UsuarioService } from 'src/app/Servicios/usuario.service';
import { AdministradorService } from 'src/app/Servicios/administrador.service';
import { Administrador } from 'src/app/Modelos/administrador';
import { EliminarAdminDialogComponent } from '../../MisDialogs/eliminar-admin-dialog/eliminar-admin-dialog.component';
import { AddAdminDialogComponent } from '../../MisDialogs/add-admin-dialog/add-admin-dialog.component';
import { InfoAdministradorDialogComponent } from '../../MisDialogs/info-administrador-dialog/info-administrador-dialog.component';


@Component({
  selector: 'app-administar-usuarios',
  templateUrl: './administar-usuarios.component.html',
  styleUrls: ['./administar-usuarios.component.css']
})
export class AdministarUsuariosComponent implements OnInit {
  id: String;
  idUser = "----";
  nombres = "----"; 
  apellidos = "----"; 
  correo = "----"; 
  rol = "----";

  fusuario = true;
  fcancelar = true; 
  ferror = false;

  administradores: any[];

  constructor(private usuarioService: UsuarioService,
    private adminService: AdministradorService,
    public dialog: MatDialog,
    ) { }

  ngOnInit() {
    this.obtenerAdministradores();
  }

 obtenerAdministradores(){
    this.administradores = [];
    this.adminService.getAdministradores()
      .subscribe(res =>{
        //console.log(res);
        const lista = res as Administrador[];
        for (const admin of lista) {
          if (admin["_id"] != "Admin") {
            this.usuarioService.getUsuario(admin["_id"])
            .subscribe(res => {
              admin["nombres"] = res["nombres"] +" "+res["apellidos"];
              admin['rol']=1;
              this.administradores.push(admin);
            });
          }
        }
        //console.log(this.administradores);
      });
  }

  buscar(){
    this.usuarioService.getUsuario(this.id)
      .subscribe(res => {
        //console.log(res);
        if (res != null) {
          this.ferror = false;
          this.fusuario = false;
          this.fcancelar = false; 
          this.id=null;
          this.idUser = res["_id"];
          this.nombres = res["nombres"];
          this.apellidos = res["apellidos"];
          this.correo = res["correo"];  
          this.rol = this.identificarRol(this.identificarAdministrador(this.idUser));
        }else{
          this.ferror = true;
          this.fusuario = true;
        }
      });
  }

  identificarRol(rol: number){
    if (rol == 1) {
      return "Administrador"
    }else{
      return "----"
    }
  }

  identificarAdministrador(id: String){
    for (const admin of this.administradores) {
      if (id === admin["_id"]) {
        this.fusuario = true;
        return 1;
      }
    }
    return 0
  }

  agregarAdministrador(rol: number){
    this.addAdminDialog(this.idUser, this.nombres+" "+this.apellidos, this.identificarRol(rol));
  }

  limpiarInformacion(){
    this.idUser = "----";
    this.nombres = "----";
    this.apellidos = "----";
    this.correo = "----";
    this.fusuario = true;
    this.fcancelar = true; 
  }

  //Dialog para agregar un nuevo administrador
  addAdminDialog(id: String, nom: String, rolNombre: String): void {
    const dialogRef = this.dialog.open(AddAdminDialogComponent, {
      data: {idUser: id,
        nombres: nom,
        rolNombre: rolNombre
        }
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log(result);
      console.log('The dialog was closed');
      if (result) {
        this.obtenerAdministradores();
        this.limpiarInformacion();
      }
    });
  }

  //Dialog para eliminar a un administrador
  openDialog(id: String, nom: String, rol: String): void {
    const dialogRef = this.dialog.open(EliminarAdminDialogComponent, {
      data: {idUser: id,
        nombres: nom,
        rol: rol}
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log(result);
      //console.log('The dialog was closed');
      if (result) {
        this.obtenerAdministradores();
      }
    });
  }

  //Dialog para ver la información de los administradores
  infoAdminDialog(id: String, nom: String, rol: String): void {
    //console.log(lista);
    const dialogRef = this.dialog.open(InfoAdministradorDialogComponent, {
      data: {idUser: id,
        nombres: nom,
        rol: rol}
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log('The dialog was closed');
      this.obtenerAdministradores();
    });
  }
}
