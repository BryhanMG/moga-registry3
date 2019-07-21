import { Component, OnInit, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-eliminar-asistente-libre-dialog',
  templateUrl: './eliminar-asistente-libre-dialog.component.html',
  styleUrls: ['./eliminar-asistente-libre-dialog.component.css']
})
export class EliminarAsistenteLibreDialogComponent implements OnInit {
  asistente: Object;
  constructor(public dialogRef: MatDialogRef<EliminarAsistenteLibreDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,) { }

  ngOnInit() {
    this.asistente = this.data["asistente"];
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  eliminarRegistro(){
    this.dialogRef.close(true);
  }

}
