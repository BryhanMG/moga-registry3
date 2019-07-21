import { Component, OnInit, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AdministradorService } from 'src/app/Servicios/administrador.service';

@Component({
  selector: 'app-eliminar-admin-dialog',
  templateUrl: './eliminar-admin-dialog.component.html',
  styleUrls: ['./eliminar-admin-dialog.component.css']
})
export class EliminarAdminDialogComponent implements OnInit {
  idUser: String;
  nombres: String;
  rol: String;
  constructor(public dialogRef: MatDialogRef<EliminarAdminDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private adminService: AdministradorService
    ) { }

  ngOnInit() {
    this.idUser = this.data["idUser"];
    this.nombres = this.data["nombres"];
    this.rol = this.data["rol"];
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  eliminarAdmin(){
    this.adminService.deleteAdministrador(this.idUser)
      .subscribe(res => {
        console.log(res);
        this.dialogRef.close(true);
      });
  }

}
