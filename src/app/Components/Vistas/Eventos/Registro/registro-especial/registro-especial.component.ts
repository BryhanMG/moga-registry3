import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {MatDialog} from '@angular/material/dialog';

import { UsuarioService } from 'src/app/Servicios/usuario.service';
import { RegistroService } from 'src/app/Servicios/registro.service';
import { EventoRegistro } from 'src/app/Modelos/eventoRegistro';
import { NotificacionBoletaDialogComponent } from 'src/app/Components/Vistas/MisDialogs/notificacion-boleta-dialog/notificacion-boleta-dialog.component';

import { ActividadService } from 'src/app/Servicios/actividad.service';
import { Actividad } from 'src/app/Modelos/actividad';

@Component({
  selector: 'app-registro-especial',
  templateUrl: './registro-especial.component.html',
  styleUrls: ['./registro-especial.component.css']
})
export class RegistroEspecialComponent implements OnInit {
  idA: String;
  idE: String;
  id: String;
  actividad = new Actividad();
  evento = new EventoRegistro();
  campos: any[];
  codigoQR: String= null;
  firstFormGroup= new FormGroup({
    id: new FormControl(''),
    nombres: new FormControl(''),
    apellidos: new FormControl(''),
    correo: new FormControl(''),
    categoria: new FormControl(''),
    fcategoria: new FormControl(''),
  });
  //Errores
  ferror = false; //error al buscar un usuario en el sistema
  ferror1 = false; //error al insertar numero de boleta
  ferror2 = false; //error al insertar un participante repetido

  constructor(private _formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private eventoService: RegistroService,
    private actividadService: ActividadService,
    private route: ActivatedRoute,
    public dialog: MatDialog
    ) { 
      
    }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      id: ['', Validators.required],
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      correo: ['', Validators.required],
      categoria: [''],
      fcategoria: [false],
    });
    this.idA = this.route.snapshot.paramMap.get('id');
    this.idE = this.route.snapshot.paramMap.get('idE');
    this.obtenerActividad(this.idA);
    this.obtenerEvento(this.idE);
    
  }

  obtenerActividad(id: String){
    //console.log(id);
    this.actividadService.getActividad(id)
      .subscribe(res => {
        this.actividad = res as Actividad;
        //console.log(this.actividad);
        this.participantes = this.actividad.asistentes;
        //console.log(this.participantes)
      });
  }

  obtenerEvento(id: String){
    this.campos = [];
    this.eventoService.getEvento(id)
      .subscribe(res =>{
        this.evento = res as EventoRegistro;
      });
  }

  buscar(){
    this.usuarioService.getUsuario(this.id)
      .subscribe(res => {
        //console.log(res);
        if (res != null) {
          this.ferror = false;
          this.id=null;
          
          this.firstFormGroup.get('id').setValue(res["_id"]);
          this.firstFormGroup.get('nombres').setValue(res["nombres"]);
          this.firstFormGroup.get('apellidos').setValue(res["apellidos"]);
          this.firstFormGroup.get('correo').setValue(res["correo"]);
        }else{
          this.ferror = true;
        }
      });
  }
  
  participantes: any[];
  participante: Object;
  registrar(){
    if (this.firstFormGroup.valid) {
      if (!this.feditar) {
        this.ferror2 = false;
        for (const participante of this.actividad.asistentes) {
          if (participante['_id'] === this.firstFormGroup.get('id').value) {
            this.ferror2 = true;
          }
        }
        if (!this.ferror2) {
          this.addParticipante();
        }
      }else{
        //console.log({participantes: [this.participante]});
        this.actividadService.deleteAsistente(this.idA, {asistentes: [this.participante]})
          .subscribe(res => {
            console.log(res);
            this.addParticipante();
          });
      }
    }
  }

  addParticipante(){
    var categoria = null;
    if (this.firstFormGroup.get('fcategoria').value) {
      categoria = this.firstFormGroup.get('categoria').value;
    }
    let pa = {asistentes: [{
      _id: this.firstFormGroup.get('id').value,
      nombres: this.firstFormGroup.get('nombres').value,
      apellidos: this.firstFormGroup.get('apellidos').value,
      correo: this.firstFormGroup.get('correo').value,
      categoria: categoria,
      autenticacion: false
      }]};
    this.actividadService.putAsistente(this.idA, pa)
      .subscribe(res => {
          console.log(res);
          this.obtenerActividad(this.idA);
          this.limpiarCampos();
      });
    
  }

  limpiarCampos(){
    this.ferror1 = false;
    this.ferror2 = false;
    this.feditar = false;
    this.firstFormGroup.get('id').setValue(null);
    this.firstFormGroup.get('nombres').setValue(null);
    this.firstFormGroup.get('apellidos').setValue(null);
    this.firstFormGroup.get('correo').setValue(null);
    this.firstFormGroup.get('categoria').setValue(null);
    this.firstFormGroup.get('fcategoria').setValue(false);
    this.limpiarCancelar = "Limpiar";
    this.registrarActualizar = "Registrar";
  }
  
  limpiarCancelar = "Limpiar";
  registrarActualizar = "Registrar";
  feditar = false;
  editarRegistro(participante: Object){
    console.log(participante);
    this.participante = participante;
    this.feditar = true;
    this.limpiarCancelar = "Cancelar";
    this.registrarActualizar = "Actualizar";

    this.firstFormGroup.get('id').setValue(participante['_id']);
    this.firstFormGroup.get('nombres').setValue(participante['nombres']);
    this.firstFormGroup.get('apellidos').setValue(participante['apellidos']);
    this.firstFormGroup.get('correo').setValue(participante['correo']);
    this.firstFormGroup.get('categoria').setValue(participante['categoria']);
    this.firstFormGroup.get('fcategoria').setValue(true);

    if (participante['categoria'] != null) {
      this.firstFormGroup.get('categoria').setValue(participante['categoria']);
      this.firstFormGroup.get('fcategoria').setValue(true);   
    }
    
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
        //console.log(result);  
      }
    });
  }

  entrada: String="";
  checked = false;
  busquedaRegistros(){
    var lista: any[];
    lista = [];
    if (this.entrada.length > 0) {
      for (const participante of this.actividad.asistentes) {
        let clave: String = participante['_id'];
        let nombre: String = participante['nombres'];
        if (clave.startsWith(this.entrada.toString()) || nombre.includes(this.entrada.toString())) {
          lista.push(participante);
        }
      }
      this.participantes = lista;      
    }else{
      this.participantes = this.actividad.asistentes;
    }
  }
  

  generarQR(){
    this.codigoQR = this.firstFormGroup.get('id').value;
    //console.log(this.codigoQR);
    
  }
}
