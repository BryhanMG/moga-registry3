import { Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ActividadService } from 'src/app/Servicios/actividad.service';
import { Actividad } from 'src/app/Modelos/actividad';
import { UsuarioService } from 'src/app/Servicios/usuario.service';
import { RegistroService } from 'src/app/Servicios/registro.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { NotificacionBoletaDialogComponent } from 'src/app/Components/Vistas/MisDialogs/notificacion-boleta-dialog/notificacion-boleta-dialog.component';

@Component({
  selector: 'app-autenticacion',
  templateUrl: './autenticacion.component.html',
  styleUrls: ['./autenticacion.component.css'],

})
export class AutenticacionComponent implements OnInit {
  idA: String; //ID de la actividad
  id: String; //ID para la busqueda del participante
  asistentes = [];
  participantes = [];
  campos = [];
  actividad = new Actividad();
  firstFormGroup= new FormGroup({
    id: new FormControl(''),
    nombres: new FormControl(''),
    apellidos: new FormControl(''),
    correo: new FormControl(''),
    boleta: new FormControl(''),
    categoria: new FormControl(''),
  });

  //Errores
  ferror = false; //error al buscar un usuario en el sistema
  ferror1 = false; //error al insertar numero de boleta
  
  constructor(private _formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private actividadService: ActividadService,
    private eventoService: RegistroService,
    private snackBar: MatSnackBar, 
    public dialog: MatDialog,
    ) {  
  } 

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      id: ['', Validators.required],
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      correo: [''],
      boleta: ['', Validators.required],
      categoria: ['',],
    });
    this.idA = this.route.snapshot.paramMap.get('id');
    this.obtenerActividad(this.idA);
  }

  obtenerActividad(id: String){
    //console.log(id);
    this.actividadService.getActividad(id)
      .subscribe(res => {
        this.actividad = res as Actividad;
        //console.log(this.actividad);
        this.obtenerParticipantes(this.actividad.id_er);
      });
  }
  asistentesTemporal = [];
  obtenerParticipantes(id: String){
    this.eventoService.getEvento(id)
      .subscribe(res => {
        this.campos = [];
          this.participantes = res['participantes'] as [];
          var campos = res['campos'] as [];
          for (const cam of campos) {
            this.campos.push({campo: cam})
          }
          
          this.asistentesTemporal = [];
          for (const asis of this.actividad['asistentes']) {
            this.llenarListaAsistentes(asis['_id']);
          }
          this.ordenarFIFO();
      });
  }

  llenarListaAsistentes(id: String){
    for (const pa of this.participantes) {
      if (id === pa['_id']) {
        this.asistentesTemporal.push(pa);
        break;
      }
    }
  }

  ordenarFIFO(){
    this.asistentes = [];
    for (let i = (this.asistentesTemporal.length-1); i >= 0 ; i--) {
      this.asistentes.push(this.asistentesTemporal[i]);
    }
    //console.log(this.participantes);
  }

  addAsistente(){
    let asistente = [{
      _id: this.firstFormGroup.get('id').value,
      nombres: this.firstFormGroup.get('nombres').value,
      apellidos: this.firstFormGroup.get('apellidos').value,
      boleta: this.firstFormGroup.get('boleta').value
    }];
    var ferror=false;
    for (const asis of this.asistentes) {
      if (this.firstFormGroup.get('id').value === asis['_id']) {
        ferror = true;
        break;
      }
    }
    if (!ferror) {
      
      this.actividadService.putAsistente(this.idA, {asistentes: asistente})
        .subscribe(res => {
          //console.log(res);
          this.openSnackBar('Asistente registrado.', 'Cerrar');
          this.obtenerActividad(this.idA);
          this.limpiarCampos();
        });  
    }else{
      this.openSnackBar('Este registro ya existe.', 'Cerrar');
    }
    
    
  }

  buscar(){
    
    if (this.participantes != null) {
      this.ferror = false;
      var fpar = false;
      for (const participante of this.participantes) {
        
        if (this.id === participante['_id']) {
          fpar = true;
          this.firstFormGroup.get('id').setValue(participante["_id"]);
          this.firstFormGroup.get('nombres').setValue(participante["nombres"]);
          this.firstFormGroup.get('apellidos').setValue(participante["apellidos"]);
          this.firstFormGroup.get('correo').setValue(participante["correo"]);
          this.firstFormGroup.get('boleta').setValue(participante["boleta"]);
          this.firstFormGroup.get('categoria').setValue(participante["categoria"]);
          this.id = null;
          break;
        }
      }
      if(!fpar){
        this.ferror = true;
      } 
    }
    
  }

  entrada: String="";
  busquedaRegistros(){
    console.log(this.entrada)
    this.asistentesTemporal = [];
    if (this.entrada && this.entrada.length > 0) {
      for (const participante of this.actividad['asistentes']) {
        let clave: String = participante['_id'];
        let nombre: String = participante['nombres'];
        console.log(participante);
        if (clave.startsWith(this.entrada.toString()) || nombre.startsWith(this.entrada.toString())) {
          this.llenarListaAsistentes(clave);
        }
      }
      this.ordenarFIFO(); 
    }else{
      for (const asis of this.actividad['asistentes']) {
        this.llenarListaAsistentes(asis['_id']);
      }
      this.ordenarFIFO();
    }
  }

  limpiarCampos(){
    this.ferror1 = false;
    this.firstFormGroup.get('id').setValue(null);
    this.firstFormGroup.get('nombres').setValue(null);
    this.firstFormGroup.get('apellidos').setValue(null);
    this.firstFormGroup.get('correo').setValue(null);
    this.firstFormGroup.get('boleta').setValue(null);
    this.firstFormGroup.get('categoria').setValue(null);
    
  }

  errorDialog(op: number, participante: Object): void {
    let f0 = false;
    let f1 = false;
    let f2 = false;
    switch (op) {
      case 0:
        f0 = true;
        break;
      case 1:
        f1 = true;
        
        break;
      case 2:
        f2 = true;
        break;
    
      default:
        break;
    }
    const dialogRef = this.dialog.open(NotificacionBoletaDialogComponent, {
      data: {participante: participante, campos: this.campos,
        error: f0,
        info: f1,
        eliminar: f2 
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      //console.log({participantes: [participante]});
      if (result) {
        let asistente = [{
          _id: participante['_id'],
          nombres: participante['nombres'],
          apellidos: participante['apellidos'],
          boleta: participante['boleta']
        }];
        this.actividadService.deleteAsistente(this.idA, {asistentes: asistente})
          .subscribe(res => {
            console.log(res);
            this.openSnackBar('Registro eliminado.', 'Cerrar');
            this.obtenerActividad(this.idA);
          });
        //console.log(result);  
      }
    });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

}
