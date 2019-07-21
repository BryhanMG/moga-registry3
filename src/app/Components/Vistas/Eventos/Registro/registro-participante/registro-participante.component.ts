import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';

import { ActividadService } from "src/app/Servicios/actividad.service";
import {RelojService} from 'src/app/Servicios/reloj.service';
import { Actividad } from 'src/app/Modelos/actividad';
import { EliminarAsistenteLibreDialogComponent } from '../../../MisDialogs/eliminar-asistente-libre-dialog/eliminar-asistente-libre-dialog.component';

@Component({
  selector: 'app-registro-participante',
  templateUrl: './registro-participante.component.html',
  styleUrls: ['./registro-participante.component.css']
})
export class RegistroParticipanteComponent implements OnInit, OnDestroy {
  
  nombreT: String = null;
  correoT: String = null;

  formGroup= new FormGroup({
    nombre: new FormControl(''),
    correo: new FormControl('')
  });

  buscar: String = null;
  bloqueo = false;
  estado: String;

  listaAsistentes= [];
  listaBuscar= [];
  idActividad: String;
  

  //Temporizadores
  private r1Subsciption;

  constructor(private _formBuilder: FormBuilder,
    private reloj: RelojService,
    private route: ActivatedRoute,
    private actividadService: ActividadService,
    public dialog: MatDialog,
    
    ) {
      this.r1Subsciption = this.reloj.time.subscribe((now: Date) => {
        //console.log("tiempo", now);
        this.obtenerActividad();
      });
     }

  ngOnInit() {
    this.formGroup = this._formBuilder.group({
      nombre: ['', Validators.required],
      correo: ['']
    });

    this.idActividad = this.route.snapshot.paramMap.get('id');
    this.obtenerAsistentes(this.idActividad);
    this.obtenerActividad();
  }

  ngOnDestroy(): void {
    this.r1Subsciption.unsubscribe();
  }

  obtenerAsistentes(id: String){
    this.listaAsistentes = [];
    this.listaBuscar = [];
    this.actividadService.getAsistentes(id)
      .subscribe(res => {
        var temp = res[0]["asistentes"] as Object[];
        for (let i = (temp.length-1); i >= 0 ; i--) {
          this.listaAsistentes.push({nombre: temp[i]["nombre"], correo: temp[i]["correo"]})
          this.listaBuscar.push({nombre: temp[i]["nombre"], correo: temp[i]["correo"]})
        }
        //console.log(this.listaAsistentes);
      });
  }

  obtenerActividad(){
    this.actividadService.getActividad(this.idActividad)
      .subscribe(res => {
        //console.log(res);
        var actividad = res as Actividad;
        if (actividad != null) {
          if (actividad["estado"] === "A") {
            this.bloqueo = false;
          }else{
            this.bloqueo = true;
            this.limpiarCampos();
          }
          this.obtenerEstado(res["estado"]);
        }
        
      });
  }

  obtenerEstado(estado: String){
    if (estado === "E") {
      this.estado = "En espera";
    }else if (estado === "A") {
      this.estado = "Activo";
    }else if (estado === "T") {
      this.estado = "Terminado";
    }
  }

  flagEdit = false;
  registrar(){
    if (this.formGroup.valid) {
      if (!this.flagEdit) {
         this.addAsistente();
      }else{
        this.eliminarEdicion();
      } 
    }
    
  }

  addAsistente(){
    var asistente = {asistentes: [{nombre: this.formGroup.get('nombre').value, correo: this.formGroup.get('correo').value}]};
    this.actividadService.putAsistente(this.idActividad, asistente)
      .subscribe(res => {
        //console.log(res);
        this.obtenerAsistentes(this.idActividad);
        this.limpiarCampos();
      }); 
  }

  eliminarEdicion(){
    var nombre = this.nombreT;
    var correo = this.correoT;
    var asistente = {asistentes: [{nombre: nombre, correo: correo}]};
    this.actividadService.deleteAsistente(this.idActividad, asistente)
      .subscribe(res => {
        //console.log(res);
        this.addAsistente();  
        
      });  
  }

  eliminar(nombre: String, correo: String){
    var asistente = {asistentes: [{nombre: nombre, correo: correo}]};
    this.actividadService.deleteAsistente(this.idActividad, asistente)
      .subscribe(res => {
        //console.log(res);
        this.obtenerAsistentes(this.idActividad);
      });
  }

  editar(nombre: String, correo: String){
    this.formGroup.get('nombre').setValue(nombre);
    this.formGroup.get('correo').setValue(correo);
    this.nombreT = nombre;
    this.correoT = correo;
    this.flagEdit = true;

  }

  limpiarCampos(){
    this.formGroup.get('nombre').setValue(null);
    this.formGroup.get('correo').setValue(null);
    this.nombreT = null;
    this.correoT = null;
    this.flagEdit = false;
  }

  buscarNombre(){
    var lista = [];
    for (const a of this.listaBuscar) {
      //console.log(ev.nombre_er);
      //console.log(a["nombre"]);
      if (a["nombre"].includes(this.buscar)) {
        lista.push(a);
      }
    }
    if (this.buscar.length == 0) {
      this.obtenerAsistentes(this.idActividad);
    }else{
      this.listaAsistentes = lista;
    }
    
  }

  actualizar(){
    this.obtenerAsistentes(this.idActividad);
  }

  eliminarAsistenteDialog(asistente: Object): void {
    //console.log(asistente);
    const dialogRef = this.dialog.open(EliminarAsistenteLibreDialogComponent, {
      data: {asistente: asistente}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.eliminar(asistente['nombre'], asistente['correo']);
      }
    });
  }

}
