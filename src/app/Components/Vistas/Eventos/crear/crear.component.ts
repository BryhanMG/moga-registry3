import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { AmazingTimePickerService } from 'amazing-time-picker';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import {MatSnackBar} from '@angular/material';
import {Location} from '@angular/common'; 
import {MatDialog} from '@angular/material/dialog';
import {MatStepper} from '@angular/material';

import { RegistroService } from "src/app/Servicios/registro.service";
import { ActividadService } from "src/app/Servicios/actividad.service";

import { CrearEdit } from "src/app/Modelos/Operaciones/crearEdit";
import { EventoRegistro } from 'src/app/Modelos/eventoRegistro';
import { ActividadNuevaLibre, ActividadNuevaPagada } from "src/app/Modelos/actividad";
import { AddCamposDialogComponent } from '../../MisDialogs/add-campos-dialog/add-campos-dialog.component';
import { RelojService } from 'src/app/Servicios/reloj.service';
import { UserService } from 'src/app/Servicios/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.css']
})
export class CrearComponent extends CrearEdit implements OnInit, OnDestroy {
  @ViewChild('stepper', {static: true}) stepper: MatStepper;
  evento = new EventoRegistro(); //evento que se esta creando

  listaActividades = [];
  listaActividadesP = [];

  tipo: String;

  feI: String; //Fecha inicio corta
  feF: String; //Fecha final corta
  fechaI: string; //Formato para MongoDB fecha inicio
  fechaF: string; //Formato para MongoDB fecha final

  feI2: String; //Fecha inicio corta
  feF2: String; //Fecha final corta
  fechaI2: string; //Formato para MongoDB fecha inicio
  fechaF2: string; //Formato para MongoDB fecha final

  listaFechas= []; //Lista de fechas elejibles para una actividad

  firstFormGroup= new FormGroup({
    nombreE: new FormControl(''),
    fechaI: new FormControl(''),
    fechaF: new FormControl(''),
    horaI: new FormControl(''),
    horaF: new FormControl(''),
    tipo: new FormControl(''),
    monto: new FormControl(''),
    categoria: new FormControl(''),
    descripcion: new FormControl(''),
    
  });

  secondFormGroup= new FormGroup({
    nombreA: new FormControl(''),
    fecha: new FormControl(''),
    horaI: new FormControl(''),
    horaF: new FormControl(''),
    tipo: new FormControl(''),
    descripcion: new FormControl(''),
    monto: new FormControl(''),
    //total: new FormControl(''),
    checked:new FormControl(''),
  });

  
  //Temporizadores
  private r1Subsciption;

  constructor(private _formBuilder: FormBuilder,
    private atp: AmazingTimePickerService,
    private eventoService: RegistroService,
    private actividadService: ActividadService,
    private snackBar: MatSnackBar,    
    private locacion: Location,
    public dialog: MatDialog,
    private reloj: RelojService,
    private userService: UserService,
    private router: Router,
    ) {
    super();
    this.r1Subsciption = this.reloj.timeSecondSession.subscribe((now: Date) => {
      //console.log(this.userService.getUserLoggedIn());
      if (!this.userService.getUserLoggedIn() ) {
        this.router.navigateByUrl('/error-logout');
      }
    });
  }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      nombreE: ['', Validators.required],
      fechaI: ['', Validators.required],
      fechaF: ['', Validators.required],
      horaI: ['', Validators.required],
      horaF: ['', Validators.required],
      tipo: ['', Validators.required],
      monto: ['', Validators.required],
      categoria: [''],
      descripcion: ['']
    });
    this.secondFormGroup = this._formBuilder.group({
      nombreA: ['', Validators.required],
      fecha: ['', Validators.required],
      horaI: ['', Validators.required],
      horaF: ['', Validators.required],
      tipo: ['', Validators.required],
      monto: ['', Validators.required],
      descripcion: [''],
      checked: [false],
    });  
    this.evento.campos = [];
  }

  ngOnDestroy(): void {
    this.r1Subsciption.unsubscribe();
  }
  
  obtenerFHIFHF_F1(){
    //console.log("Prueba: ",this.firstFormGroup.get("fechaI").value);
    this.fechaI = this.obtenerFecha(new Date(this.firstFormGroup.get("fechaI").value), this.firstFormGroup.get("horaI").value);
    this.fechaF = this.obtenerFecha(new Date(this.firstFormGroup.get("fechaF").value), this.firstFormGroup.get("horaF").value);
    this.feI = this.fechaI.substring(0, 10);
    this.feF = this.fechaF.substring(0, 10);
        
    this.cargarDatosEvento();
    this.obtenerListFechas();

    //this.limpiarCamposActividades();
  }

  obtenerFHIFHF_F2(){
    this.fechaI2 = this.obtenerFecha(new Date(this.secondFormGroup.get("fecha").value), this.secondFormGroup.get("horaI").value);
    this.fechaF2 = this.obtenerFecha(new Date(this.secondFormGroup.get("fecha").value), this.secondFormGroup.get("horaF").value);
    this.feI2 = this.fechaI2.substring(0, 10);
    this.feF2 = this.fechaF2.substring(0, 10);
    this.addActividad();
  }

  mover(){
    if (this.firstFormGroup.valid) {
      this.obtenerFHIFHF_F1();
      this.stepper.next();  
    }
    
    
  }
  
  addCategoria(){
    var ferror = false;
    var entrada: String = this.firstFormGroup.get('categoria').value;
    if (entrada.length > 0) {
      for (const cat of this.evento.categorias) {
        if (cat === entrada) {
          this.openSnackBar("La categoría ya existe.", "Cerrar"); 
          ferror = true;
          break;
        }
      }
      if (!ferror) {
        this.firstFormGroup.get('categoria').setValue('');
        this.openSnackBar("Categoría registrada.", "Cerrar");
        this.evento.categorias.push(entrada);  
        //console.log(this.evento);
      }  
    }else{
      this.openSnackBar("Entrada vacía.", "Cerrar");
    }
  }

  dellCategoria(entrada: String){
    for (let i = 0; i < this.evento.categorias.length; i++) {
      const cat = this.evento.categorias[i];
      if (cat === entrada) {
        this.evento.categorias.splice(i, 1);
        this.openSnackBar("Categoría eliminada.", "Cerrar");
        break;
      }      
    }
  }

  seleccionarTipoEvento(){
    //console.log("Entra");
    if (this.firstFormGroup.get('tipo').value === 'P') {
      this.firstFormGroup.controls["monto"].enable();
      this.firstFormGroup.controls["categoria"].enable();
    }else{
      this.firstFormGroup.get("monto").setValue("");
      this.firstFormGroup.controls["monto"].disable();
      this.firstFormGroup.controls["categoria"].disable();
    }
    return true;
  }

  limpiarCamposActividades(){
    this.feditar = false;
    this.idEditar = null;
    this.secondFormGroup.get("nombreA").setValue(null);
    this.secondFormGroup.get("fecha").setValue(null);
    this.secondFormGroup.get("horaI").setValue(null);
    this.secondFormGroup.get("horaF").setValue(null);
    this.secondFormGroup.get('tipo').setValue(null);
    this.secondFormGroup.get('monto').setValue(null);
    this.secondFormGroup.get("checked").setValue(false);
    this.secondFormGroup.get('descripcion').setValue(null);
  }

  //------------------------------------------------------------------------------

  obtenerListFechas(){ //Lista de fechas elegibles en base al intervalo elegido para el evento
    this.listaFechas = [];
    var lFechaI = new Date(this.firstFormGroup.get("fechaI").value);
    var lFechaF = new Date(this.firstFormGroup.get("fechaF").value);
    console.log("Prueba",lFechaI.getDate());
    var temp = lFechaI;
    var n = 0;
    
    while (temp.valueOf() <= lFechaF.valueOf()) {
      this.listaFechas.push({fecha: new Date(temp), sFecha: this.obtenerFecha(new Date(temp), this.firstFormGroup.get("horaI").value).substring(0, 10)});
      temp.setDate(temp.getDate()+1)

      n++;
      if (n >50) {
        break;
      }
    }
    console.log(this.listaFechas);
  }
  flagG = false;
  noA = 0;
  activacionGenerica(){ //Llenar el formulario de actividad con valores genericos
    //console.log(!this.secondFormGroup.get("checked").value);
    //this.flagG = !this.secondFormGroup.get("checked").value;
    if (!this.secondFormGroup.get("checked").value) {
      this.secondFormGroup.get("nombreA").setValue("Actividad No. "+this.noA);
      //console.log(this.listaFechas[0]['fecha']);
      this.secondFormGroup.get("horaI").setValue(this.fechaI.substring(11, 16));
      this.secondFormGroup.get("horaF").setValue(this.fechaF.substring(11, 16));
      
    }else{
      this.secondFormGroup.get("nombreA").setValue(null);
      this.secondFormGroup.get("fecha").setValue(null);
      this.secondFormGroup.get("horaI").setValue(null);
      this.secondFormGroup.get("horaF").setValue(null);
    }
  }

  cargarDatosEvento(){
    this.eventoService.getEventosCount()
      .subscribe(res => {
        this.eventoService.conteo = res as number;
        
        let f = new Date(this.firstFormGroup.get('fechaI').value);
        this.evento._id = "EVT"+this.eventoService.conteo+"RE"+f.getFullYear();
        this.evento.nombre_er = this.firstFormGroup.get('nombreE').value;
        this.evento.fecha_i = this.fechaI;
        this.evento.fecha_f = this.fechaF;
        this.evento.descripcion = this.firstFormGroup.get('descripcion').value;
        this.evento.estado = "E";
        this.evento.tipo = this.firstFormGroup.get('tipo').value;
        this.evento.monto = this.firstFormGroup.get('monto').value;
        //console.log(this.evento);
        if (this.evento.tipo === 'L') {
          this.secondFormGroup.controls['tipo'].disable();
          this.secondFormGroup.controls['monto'].disable();
        }
      });
    
  }
  
  comprobarInformacionActividad(){
    //console.log("Pasa: "+this.secondFormGroup.valid);
    if (this.secondFormGroup.valid) {
        this.obtenerFHIFHF_F2();
    }else{
      this.openSnackBar("Debe completar los campos indicados (*)", "Cerrar"); 
    }
    
  }

  seleccionTipoActividad(){
    //console.log("Tipo de actividad: "+this.secondFormGroup.get('tipo').value);
    if (this.secondFormGroup.get('tipo').value === '2'){
      this.secondFormGroup.controls["monto"].enable();
    }else{
      this.secondFormGroup.get("monto").setValue("");
      this.secondFormGroup.controls["monto"].disable();
    }
    return true;
  }

  //------------------------------------------------------------------------
  addActividad(){
    if (!this.feditar) {
      if (this.evento.tipo === "L") {
        var actividad = new ActividadNuevaLibre(this.evento._id, this.secondFormGroup.get("nombreA").value,
        this.fechaI2, this.fechaF2, this.secondFormGroup.get("descripcion").value, "E", 0);
        this.listaActividades.push({id: this.noA, actividad: actividad});
        //console.log(this.listaActividades);
        this.limpiarCamposActividades();
      }else{
        var actividadP = new ActividadNuevaPagada(this.evento._id, this.secondFormGroup.get("nombreA").value,
        this.fechaI2, this.fechaF2, this.secondFormGroup.get("descripcion").value, "E", +this.secondFormGroup.get("tipo").value,
        this.secondFormGroup.get('monto').value);
        this.listaActividadesP.push({id: this.noA, actividad: actividadP});
        //console.log(this.listaActividadesP);
        this.limpiarCamposActividades();
      }
      
      this.noA++;
    }else{
      this.cambiarActividad(this.idEditar);
    }

  }


  feditar = false;
  idEditar: String;
  editarActividad(actividad: Object){
    this.feditar = true;
    //console.log(actividad);
    if (this.evento.tipo === "L") {
      this.idEditar = actividad['id'];
      this.secondFormGroup.get("nombreA").setValue(actividad['actividad']['nombre_a']);
      for (const fec of this.listaFechas) {
        if (fec['sFecha'] === actividad['actividad']['fecha_i'].substring(0,10)) {
          this.secondFormGroup.get("fecha").setValue(fec['fecha']);    
          break
        }
      }
      this.secondFormGroup.get("horaI").setValue(actividad['actividad']['fecha_i'].substring(11, 16));
      this.secondFormGroup.get("horaF").setValue(actividad['actividad']['fecha_f'].substring(11, 16));
      this.secondFormGroup.get("checked").setValue(false);
      this.secondFormGroup.get('descripcion').setValue(actividad['actividad']['descripcion']);

    }else{
      //console.log("tipo:"+actividad['actividad']['tipo'])
      this.idEditar = actividad['id'];
      this.secondFormGroup.get("nombreA").setValue(actividad['actividad']['nombre_a']);
      for (const fec of this.listaFechas) {
        if (fec['sFecha'] === actividad['actividad']['fecha_i'].substring(0,10)) {
          this.secondFormGroup.get("fecha").setValue(fec['fecha']);    
          break
        }
      }
      this.secondFormGroup.get("horaI").setValue(actividad['actividad']['fecha_i'].substring(11, 16));
      this.secondFormGroup.get("horaF").setValue(actividad['actividad']['fecha_f'].substring(11, 16));
      this.secondFormGroup.get("checked").setValue(false);
      this.secondFormGroup.get('descripcion').setValue(actividad['actividad']['descripcion']);
      this.secondFormGroup.get('tipo').setValue(actividad['actividad']['tipo']+"");
      this.secondFormGroup.get('monto').setValue(actividad['actividad']['monto']);
    }

  }

  cambiarActividad(id: String){
    //console.log(id);
    if (this.evento.tipo === "L") {
      for (const actividad of this.listaActividades) {
        if (id === actividad['id']) {
          //console.log(actividad);    
          var actividadNueva;
          actividadNueva = new ActividadNuevaLibre(this.evento._id, this.secondFormGroup.get("nombreA").value,
          this.fechaI2, this.fechaF2, this.secondFormGroup.get("descripcion").value, "E", 0);  
          
          actividad['actividad'] = actividadNueva;
          //console.log(actividad);        
        }
      }  
    }else{
      for (const actividad of this.listaActividadesP) {
        if (id === actividad['id']) {
          //console.log(actividad);    
          var actividadNueva;
          actividadNueva = new ActividadNuevaPagada(this.evento._id, this.secondFormGroup.get("nombreA").value,
          this.fechaI2, this.fechaF2, this.secondFormGroup.get("descripcion").value, "E", +this.secondFormGroup.get("tipo").value,
          this.secondFormGroup.get('monto').value);
        
          actividad['actividad'] = actividadNueva;
          //console.log(actividad);        
        }
      }
    }
    
    this.limpiarCamposActividades();
  }

  deleteActividad(id: number){
    var n = 0;
    if(this.evento.tipo === "L"){
      for (const actividad of this.listaActividades) {
        if (id == actividad["id"]) {
          
          this.listaActividades.splice(n, 1);
          this.openSnackBar("Actividad eliminada", "Cerrar");      
          break;
        }
        n++;
      }
    }else{
      for (const actividad of this.listaActividadesP) {
        if (id == actividad["id"]) {
          
          this.listaActividadesP.splice(n, 1);
          this.openSnackBar("Actividad eliminada", "Cerrar");      
          break;
        }
        n++;
      }
    }
    
  }

  obtenerTipoActividad(tipo: number){
    switch (tipo) {
      case 0:
        return "Libre";  
        break;
      case 1:
        return "General";  
        break;
      case 2:
        return "Especial de pago";  
        break;
      default:
        break;
    }
  }

  //Crear evento
  crearEvento(){
    //console.log(this.evento);
    //console.log(this.listaActividades);
    this.eventoService.postEvento(this.evento)
      .subscribe(res =>{
        console.log(res);
        this.openSnackBar("Evento creado", "Cerrar");
        if (this.evento.tipo === 'L') {
          for (const actividad of this.listaActividades) {
            this.actividadService.postActividad(actividad["actividad"])
              .subscribe(res => {
                console.log(res);
              });  
          }  
        }else{
          for (const actividad of this.listaActividadesP) {
            this.actividadService.postActividad(actividad["actividad"])
              .subscribe(res => {
                console.log(res);
              });  
          }  
        }
        
        this.locacion.back();
      });
  }

  //Servicio para el timepicker
  open(){
    const amazingTimePicker = this.atp.open();
    amazingTimePicker.afterClose()
      .subscribe(time =>{
        console.log(time);
    });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  //Dialog para agregar campos al registro
  addCamposDialog(): void {
    const dialogRef = this.dialog.open(AddCamposDialogComponent, {
      data: {campos: this.evento.campos}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !=null) {
        this.evento.campos = result as [];
        console.log(this.evento.campos);  
      }
      console.log('The dialog was closed');
    });
  }
}
