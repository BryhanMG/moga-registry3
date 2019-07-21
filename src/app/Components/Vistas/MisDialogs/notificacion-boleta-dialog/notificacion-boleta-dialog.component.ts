import { Component, OnInit, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-notificacion-boleta-dialog',
  templateUrl: './notificacion-boleta-dialog.component.html',
  styleUrls: ['./notificacion-boleta-dialog.component.css']
})
export class NotificacionBoletaDialogComponent implements OnInit {
  participante: Object;
  campos: [];
  f0 = false;//badera de error
  f1 = false;//bandera de informacion
  f2 = false;//bandera de eliminacion
  constructor(public dialogRef: MatDialogRef<NotificacionBoletaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.participante = this.data['participante'];
    this.campos = this.data['campos'];
    this.f0 = this.data['error'];
    this.f1 = this.data['info'];
    this.f2 = this.data['eliminar'];
    //console.log(this.campos);
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  eliminarRegistro(){
    this.dialogRef.close(true);
  }

}
