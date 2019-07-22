import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';

import { UsuarioService } from 'src/app/Servicios/usuario.service';
import { Usuario } from 'src/app/Modelos/usuario';
import { EliminarUsuarioDialogComponent } from '../../MisDialogs/eliminar-usuario-dialog/eliminar-usuario-dialog.component';
import { ImportRegistrosDialogComponent } from '../../MisDialogs/import-registros-dialog/import-registros-dialog.component';

@Component({
  selector: 'app-registro-general',
  templateUrl: './registro-general.component.html',
  styleUrls: ['./registro-general.component.css']
})
export class RegistroGeneralComponent implements OnInit {
  opCancelar = "Limpiar";
  
  formGroup= new FormGroup({
    idUsuario: new FormControl(''),
    nombres: new FormControl(''),
    apellidos: new FormControl(''),
    correo: new FormControl('')
  });

  constructor(
    private _formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    public dialog: MatDialog,
    
    ) {}

  ngOnInit() {
    this.formGroup = this._formBuilder.group({
      idUsuario: ['', Validators.required],
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      correo: ['']
    }); 
  }

  //Registrar usuario
  guardarUsuario(){
    if (this.formGroup.valid) {
      var usuario = new Usuario();
      usuario._id = this.formGroup.get("idUsuario").value;
      usuario.nombres = this.formGroup.get("nombres").value;
      usuario.apellidos = this.formGroup.get("apellidos").value;
      usuario.correo = this.formGroup.get('correo').value;

      if (this.editar) {
        this.usuarioService.putUsuario(usuario)
          .subscribe(res=>{
            //console.log(res);
            this.limpiarCampos();
            this.editar =false;
          });
      }else{
        this.usuarioService.postUsuario(usuario)
          .subscribe(res => {
            //console.log(res);
            this.limpiarCampos();
          });
      }
      //console.log("Entra aqui: "+this.formGroup.valid);  
    }
  }

  //Limpiar campos del registro
  limpiarCampos(){
    if (this.editar) {
     this.formGroup.controls["idUsuario"].enable();
     this.opCancelar = "Limpiar"; 
     this.editar = false;
    }
    this.formGroup.get("idUsuario").setValue("");
    this.formGroup.get("nombres").setValue("");
    this.formGroup.get("apellidos").setValue("");
    this.formGroup.get("correo").setValue("");
    
  }



  //Realizar busqueda y ver información del registro del usuario.
  idUser = "----"
  nombres = "----"
  apellidos = "----"
  correo = "----"
  id: String;
  ferror = false;
  fusuario = true;
  buscar(){
    this.usuarioService.getUsuario(this.id)
      .subscribe(res => {
        //console.log(res);
        if (res != null) {
          this.ferror = false;
          this.fusuario = false;
          this.id=null;
          this.idUser = res["_id"];
          this.nombres = res["nombres"];
          this.apellidos = res["apellidos"];
          this.correo = res["correo"];  
        }else{
          this.ferror = true;
          this.fusuario = true;
        }
      });
  }

  limpiarInformacion(){
    this.idUser = "----";
    this.nombres = "----";
    this.apellidos = "----";
    this.correo = "----";
    this.fusuario = true;
  }

  editar = false;
  editarRegistro(){
    this.editar = true;
    this.formGroup.get("idUsuario").setValue(this.idUser);
    this.formGroup.controls["idUsuario"].disable();
    this.formGroup.get("nombres").setValue(this.nombres);
    this.formGroup.get("apellidos").setValue(this.apellidos);
    this.formGroup.get("correo").setValue(this.correo);
    this.opCancelar = "Cancelar";
    this.fusuario = false;
    this.limpiarInformacion();
  }

  //Eliminar registro
  eliminarRegistro(){
    this.openDialog();
    
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(EliminarUsuarioDialogComponent, {
      data: {idUser: this.idUser,
        nombres: this.nombres,
        apellidos: this.apellidos,
        correo: this.correo}
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log(result);
      console.log('The dialog was closed');
      if (result) {
        this.limpiarInformacion();
      }
    });
  }

  importDialog(): void {
    const dialogRef = this.dialog.open(ImportRegistrosDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      //console.log(result);
      //console.log('The dialog was closed');
      
    });
  }
 

}

