import { Component, OnInit, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-eliminar-evento-dialog',
  templateUrl: './eliminar-evento-dialog.component.html',
  styleUrls: ['./eliminar-evento-dialog.component.css']
})
export class EliminarEventoDialogComponent implements OnInit {
  id: String;
  nombre: String;

  constructor(public dialogRef: MatDialogRef<EliminarEventoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,) { }

  ngOnInit() {
    //console.log(this.data["nombre"]);
    this.id = this.data["idEvento"];
    this.nombre = this.data["nombre"];
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  eliminar(): void {
    this.dialogRef.close(true);
  }
}
