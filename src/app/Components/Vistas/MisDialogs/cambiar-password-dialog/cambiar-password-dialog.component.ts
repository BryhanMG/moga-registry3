import { Component, OnInit, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { AdministradorService } from 'src/app/Servicios/administrador.service';

@Component({
  selector: 'app-cambiar-password-dialog',
  templateUrl: './cambiar-password-dialog.component.html',
  styleUrls: ['./cambiar-password-dialog.component.css']
})
export class CambiarPasswordDialogComponent implements OnInit {
  idUser: String;
  password: String;

  formGroup= new FormGroup({
    passActual: new FormControl(''),
    passNuevo: new FormControl(''),
    passValidar: new FormControl('')
  });

  constructor(public dialogRef: MatDialogRef<CambiarPasswordDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder,
    private administradorService: AdministradorService) { }

  ngOnInit() {
    this.idUser = this.data["idUser"];
    this.obtenerAdmin();
    this.formGroup = this._formBuilder.group({
      passActual: ['', Validators.required],
      passNuevo: ['', Validators.required],
      passValidar: ['', Validators.required]
    }); 
  }

  onNoClick(): void {
    this.dialogRef.close(null);
  }

  obtenerAdmin(){
    this.administradorService.getAdministrador(this.idUser)
      .subscribe(res => {
        this.password = res[0]['password'];
      });
  }

  tipo1= "password";
  fpass1 = false;
  showHidePassword1(){
    this.fpass1 = !this.fpass1;
    if (this.fpass1) {
      this.tipo1 = "text";
    }else{
      this.tipo1 = "password";
    }
  }

  tipo2= "password";
  fpass2 = false;
  showHidePassword2(){
    this.fpass2 = !this.fpass2;
    if (this.fpass2) {
      this.tipo2 = "text";
    }else{
      this.tipo2 = "password";
    }
  }

  tipo3= "password";
  fpass3 = false;
  showHidePassword3(){
    this.fpass3 = !this.fpass3;
    if (this.fpass3) {
      this.tipo3 = "text";
    }else{
      this.tipo3 = "password";
    }
  }

  fload = false;
  fcarga = false;
  ferror1 = false;
  ferror2 = false;
  mensaje: String;
  async cambiarPassword(){
    this.fload = false;
    this.fcarga = false;
    this.ferror1 = false;
    this.ferror2 = false;
    if (this.formGroup.valid) {
      if(this.formGroup.get('passActual').value === this.password){
        if (this.formGroup.get('passNuevo').value === this.formGroup.get('passValidar').value) {
          this.mensaje = "Cambiando la contraseña, espere por favor.";
          this.fload = true;
          await this.delay(2000);
          this.administradorService.putAdministradorPass({
            _id: this.idUser,
            password: this.formGroup.get('passValidar').value
          }).subscribe(res=>{
            console.log(res);
            this.fload = false;
            this.fcarga = true;
            this.mensaje = "Se ha cambiado la contraseña exitosamente."
            this.ferror1 = false;
            this.ferror2 = false;
            this.limpiarCampos();
          }, error => {
            this.fload = false;
          });    
        }{
          this.ferror2 = true;
          this.mensaje = "Error al validar la nueva contraseña. No coinciden."
        }
      }else{
        this.ferror1 = true;
        this.mensaje = "La contraseña actual ingresada no coincide."
      }
      
    }
    
  }
  
  limpiarCampos(){
    this.formGroup.get('passActual').setValue('');
    this.formGroup.get('passNuevo').setValue('');
    this.formGroup.get('passValidar').setValue('');
    this.fpass1 = false;
    this.fpass2 = false;
    this.fpass3 = false;
    this.tipo1 = "password";
    this.tipo2 = "password";
    this.tipo3 = "password";
  }

  private delay(ms: number): Promise<boolean> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(true);
      }, ms);
    });
  }

}
