import { Component, OnInit, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { UsuarioService } from "src/app/Servicios/usuario.service";

@Component({
  selector: 'app-eliminar-usuario-dialog',
  templateUrl: './eliminar-usuario-dialog.component.html',
  styleUrls: ['./eliminar-usuario-dialog.component.css']
})
export class EliminarUsuarioDialogComponent implements OnInit {
  idUser: String;
  nombres: String;
  apellidos: String;
  correo: String;
  constructor(public dialogRef: MatDialogRef<EliminarUsuarioDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private usuarioService: UsuarioService
    ) { }

  ngOnInit() {
    this.idUser = this.data["idUser"];
    this.nombres = this.data["nombres"];
    this.apellidos = this.data["apellidos"];
    this.correo = this.data["correo"];
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  eliminarRegistro(){
    this.usuarioService.deleteUsuario(this.idUser)
      .subscribe(res => {
        //console.log(res);
        this.dialogRef.close(true);
        
      });
  }

}
