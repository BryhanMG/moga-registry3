import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-terminar-evento-dialog',
  templateUrl: './terminar-evento-dialog.component.html',
  styleUrls: ['./terminar-evento-dialog.component.css']
})
export class TerminarEventoDialogComponent implements OnInit {
  id = new String();
  nombre = new String();
  constructor(public dialogRef: MatDialogRef<TerminarEventoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,) { }

  ngOnInit() {
    this.id = this.data["id"];
    this.nombre = this.data["nombre"];
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.dialogRef.close(true);
  }
}
