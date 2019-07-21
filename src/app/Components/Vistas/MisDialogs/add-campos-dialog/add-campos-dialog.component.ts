import { Component, OnInit, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';

@Component({
  selector: 'app-add-campos-dialog',
  templateUrl: './add-campos-dialog.component.html',
  styleUrls: ['./add-campos-dialog.component.css']
})
export class AddCamposDialogComponent implements OnInit {
  campos: any[];
  lista: any[];
  formGroup= new FormGroup({
    nombre: new FormControl('')
  });

  constructor(public dialogRef: MatDialogRef<AddCamposDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder,) { }

  ngOnInit() {
    this.formGroup = this._formBuilder.group({
      nombre: ['', Validators.required]
    });
    this.lista = [];
    var campos = this.data['campos'];
    for (let i = 0; i < campos.length; i++) {
      this.lista.push({id: i, campo: campos[i]});
    }
    //console.log(this.lista);
  }

  onNoClick(): void {
    this.dialogRef.close(null);
  }

  addCampo(){
    if (this.formGroup.valid) {
      this.lista.push({id: this.lista.length, campo: this.formGroup.get('nombre').value})
      this.formGroup.get('nombre').setValue(null);
      //console.log(this.lista);
    }
  }

  deleteCampos(id: number){
    this.lista.splice(id, 1);
  }

  guardarCampos(){
    this.campos = [];
    for (const campo of this.lista) {
      this.campos.push(campo['campo']);
    }
    this.dialogRef.close(this.campos);
  }

}
