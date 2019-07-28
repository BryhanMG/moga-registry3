import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-tipo-actividad-dialog',
  templateUrl: './tipo-actividad-dialog.component.html',
  styleUrls: ['./tipo-actividad-dialog.component.css']
})
export class TipoActividadDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<TipoActividadDialogComponent>,) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }
}
