import { Component, OnInit } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import * as XLSX from 'xlsx';
import { Usuario } from 'src/app/Modelos/usuario';
import { UsuarioService } from 'src/app/Servicios/usuario.service';

@Component({
  selector: 'app-import-registros-dialog',
  templateUrl: './import-registros-dialog.component.html',
  styleUrls: ['./import-registros-dialog.component.css']
})
export class ImportRegistrosDialogComponent implements OnInit {
  private datos: [];

  constructor(public dialogRef: MatDialogRef<ImportRegistrosDialogComponent>,
    private usuarioService: UsuarioService
    ) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onFileChange(ev) {
    let workBook = null;
    let jsonData = null;
    const reader = new FileReader();
    const file = ev.target.files[0];
    reader.onload = (event) => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary' });
      jsonData = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});
      const dataString = JSON.stringify(jsonData);
      this.datos = jsonData;
      //console.log(jsonData);
      //document.getElementById('output').innerHTML = dataString.slice(0, 300).concat("...");
      
    }
    reader.readAsBinaryString(file);
  }

  ferror = false;
  fpass = false;
  listaErrorInsert = [];
  mensajeError = "";
  async subirDatos(){
    for (const hoja in this.datos) {
      //console.log(hoja);
      for (const user of this.datos[hoja.toString()]) {
        //console.log(user);
        let u: Usuario = {_id: user['_id'], nombres: user['nombres'], apellidos: user['apellidos'], correo: user['correo'] || ''}
        //console.log(u);
        this.usuarioService.postUsuario(u)
          .subscribe(res => {
            if (res === 'E001') {
              this.listaErrorInsert.push(u);
            }
            console.log(res);
          });
      }
    }
    await this.delay(1000);
    if (this.listaErrorInsert.length == 0) {
      this.fpass = true;
      this.mensajeError = "¡Finalizado con éxito!"
    }else{
      this.ferror = true;
      this.mensajeError = "¡Finalizado con error!"
    }
  }

  private delay(ms: number): Promise<boolean> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(true);
      }, ms);
    });
  }
}
