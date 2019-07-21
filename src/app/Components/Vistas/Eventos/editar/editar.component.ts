import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
import { ActividadNuevaLibre, Actividad, ActividadNuevaPagada } from "src/app/Modelos/actividad";
import { AddCamposDialogComponent } from '../../MisDialogs/add-campos-dialog/add-campos-dialog.component';
import { RelojService } from 'src/app/Servicios/reloj.service';
import { UserService } from 'src/app/Servicios/user.service';



@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.css']
})
export class EditarComponent extends CrearEdit implements OnInit, OnDestroy {
  @ViewChild('stepper', {static: true}) stepper: MatStepper;  
  evento = new EventoRegistro; //evento que se esta creando
  listaActividades = [];
  listaActividadesEliminadas = [];

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
    private route: ActivatedRoute,
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
      //total: ['', Validators.required],
      descripcion: [''],
      checked: [false],
    });  
    this.obtenerEvento(this.route.snapshot.paramMap.get('id'));
    this.obtenerActividades(this.route.snapshot.paramMap.get('id'));
    
  }

  ngOnDestroy(): void {
    this.r1Subsciption.unsubscribe();
  }

  obtenerEvento(id){
    this.eventoService.getEvento(id)
      .subscribe(res =>{
        this.evento = res as EventoRegistro;
        console.log(this.evento);
        this.firstFormGroup.get('nombreE').setValue(this.evento.nombre_er);
        var FI = new Date(this.evento.fecha_i.substring(0, 10));
        FI.setDate(FI.getDate()+1);
        this.firstFormGroup.get('fechaI').setValue(FI);
        var FF = new Date(this.evento.fecha_f.substring(0, 10));
        FF.setDate(FF.getDate()+1);
        this.firstFormGroup.get('fechaF').setValue(FF);
        this.firstFormGroup.get('horaI').setValue(this.evento.fecha_i.substring(11, 16));
        this.firstFormGroup.get('horaF').setValue(this.evento.fecha_f.substring(11, 16));
        this.firstFormGroup.get('descripcion').setValue(this.evento.descripcion);
        this.firstFormGroup.get('monto').setValue(this.evento.monto);
        this.firstFormGroup.get('tipo').setValue(this.evento.tipo);
        this.firstFormGroup.controls['tipo'].disable();
        this.obtenerListFechas();
        if (this.evento.tipo === 'L') {
          this.secondFormGroup.controls['tipo'].disable();
          this.secondFormGroup.controls['monto'].disable();
        }
      });
  }

  obtenerActividades(id: String){
    this.listaActividades = [];
    this.actividadService.getActividades(id)
      .subscribe(res => {
        var la = res as Actividad[];
        for (const a of la) {
          this.listaActividades.push({id: a._id, actividad: a, nuevo: false, actualizar: false});
        }
        
        console.log(this.listaActividades);
        
      });
  }

  seleccionarTipoEvento(){
    //console.log("Entra");
    if (this.firstFormGroup.get('tipo').value === 'P') {
      this.firstFormGroup.controls["monto"].enable();
    }else{
      this.firstFormGroup.get("monto").setValue("");
      this.firstFormGroup.controls["monto"].disable();
    }
    return true;
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

  obtenerFHIFHF_F1(flag: boolean){
    //console.log("Prueba: ",this.firstFormGroup.get("fechaI").value);
    this.fechaI = this.obtenerFecha(new Date(this.firstFormGroup.get("fechaI").value), this.firstFormGroup.get("horaI").value);
    this.fechaF = this.obtenerFecha(new Date(this.firstFormGroup.get("fechaF").value), this.firstFormGroup.get("horaF").value);
    this.feI = this.fechaI.substring(0, 10);
    this.feF = this.fechaF.substring(0, 10);
    if (flag) {
      this.cargarDatosEvento();  
    }else{
      this.obtenerListFechas();
    }
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
      this.obtenerFHIFHF_F1(false);
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

  //------------------------------------------------------------------------------
  obtenerListFechas(){ //Lista de fechas elegibles en base al intervalo elegido para el evento
    this.listaFechas = [];
    var lFechaI = new Date(this.firstFormGroup.get("fechaI").value);
    var lFechaF = new Date(this.firstFormGroup.get("fechaF").value);
    //console.log("Prueba",lFechaF);
    var temp = lFechaI;
    var n = 0;
    
    while (temp.getDate().valueOf() <= lFechaF.getDate().valueOf() ) {
      //console.log(temp.valueOf()," <= ", lFechaF.valueOf());
      this.listaFechas.push({fecha: new Date(temp), sFecha: this.obtenerFecha(new Date(temp), this.firstFormGroup.get("horaI").value).substring(0, 10)});
      temp.setDate(temp.getDate()+1)

      n++;
      if (n >50) {
        break;
      }
    }
    //console.log(temp.getDate.valueOf()," <= ", lFechaF.getDate.valueOf());
    //console.log(temp," <= ", lFechaF);
    //console.log(this.listaFechas);
  }
  
  flagG = false;
  noA = 0;
  activacionGenerica(){ //Llenar el formulario de actividad con valores genericos
    //console.log(!this.secondFormGroup.get("checked").value);
    //this.flagG = !this.secondFormGroup.get("checked").value;
    if (!this.secondFormGroup.get("checked").value) {
      this.secondFormGroup.get("nombreA").setValue("Actividad No. "+this.noA);
      //console.log(this.listaFechas[0]['fecha']);
      this.secondFormGroup.get("horaI").setValue((this.obtenerFecha(new Date(this.firstFormGroup.get("fechaI").value), this.firstFormGroup.get("horaI").value)).substring(11, 16));
      this.secondFormGroup.get("horaF").setValue((this.obtenerFecha(new Date(this.firstFormGroup.get("fechaF").value), this.firstFormGroup.get("horaF").value)).substring(11, 16));
      //this.secondFormGroup.get("total").setValue(0);
      
    }else{
      this.secondFormGroup.get("nombreA").setValue(null);
      this.secondFormGroup.get("fecha").setValue(null);
      this.secondFormGroup.get("horaI").setValue(null);
      this.secondFormGroup.get("horaF").setValue(null);
      
    }
  }

  cargarDatosEvento(){
    this.evento.nombre_er = this.firstFormGroup.get('nombreE').value;
    this.evento.fecha_i = this.fechaI;
    this.evento.fecha_f = this.fechaF;
    this.evento.descripcion = this.firstFormGroup.get('descripcion').value;
    //console.log(this.evento);
    this.obtenerListFechas();
    this.acuralizarEvento();
  }
  
  comprobarInformacionActividad(){
    if (this.secondFormGroup.valid) {
        this.obtenerFHIFHF_F2();
    }else{
      this.openSnackBar("Debe completar los campos indicados (*)", "Cerrar"); 
    }
  }

 //------------------------------------------------------------------------
  addActividad(){
    if (!this.feditar) {
      if (this.evento.tipo === "L") {
        var actividad = new ActividadNuevaLibre(this.evento._id, this.secondFormGroup.get("nombreA").value,
        this.fechaI2, this.fechaF2, this.secondFormGroup.get("descripcion").value, "E", 0);
        this.listaActividades.push({id: this.noA, actividad: actividad, nuevo: true, actualizar: false});
        //console.log(this.listaActividades);
        this.limpiarCampos();
      }else{
        var actividadP = new ActividadNuevaPagada(this.evento._id, this.secondFormGroup.get("nombreA").value,
        this.fechaI2, this.fechaF2, this.secondFormGroup.get("descripcion").value, "E", +this.secondFormGroup.get("tipo").value,
        this.secondFormGroup.get('monto').value);
        this.listaActividades.push({id: this.noA, actividad: actividadP, nuevo: true, actualizar: false});
        //console.log(this.listaActividades);
        this.limpiarCampos();
      }
      
      this.noA++;
    }else{
      this.cambiarActividad(this.idEditar);
    }

  }

  limpiarCampos(){
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

  feditar = false;
  idEditar: String;
  fGuardado= false;
  editarActividad(actividad: Object){
    this.feditar = true;
    console.log(actividad);
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
    this.fGuardado = true;
    for (const actividad of this.listaActividades) {
      if (id === actividad['id']) {
        //console.log(actividad);    
        var actividadNueva;
        if (this.evento.tipo === "L") {
          actividadNueva = new ActividadNuevaLibre(this.evento._id, this.secondFormGroup.get("nombreA").value,
          this.fechaI2, this.fechaF2, this.secondFormGroup.get("descripcion").value, "E", 0);  
        }else{
          actividadNueva = new ActividadNuevaPagada(this.evento._id, this.secondFormGroup.get("nombreA").value,
          this.fechaI2, this.fechaF2, this.secondFormGroup.get("descripcion").value, "E", +this.secondFormGroup.get("tipo").value,
          this.secondFormGroup.get('monto').value); 
        }
        
        actividad['actividad'] = actividadNueva;
        if (!actividad['nuevo']) {
          actividad['actualizar'] = true;  
        }
        //console.log(actividad);        
      }
    }
    this.limpiarCampos();
  }

  deleteActividad(id: number){
    var n = 0;
    this.fGuardado = true;
    for (const actividad of this.listaActividades) {
      if (id == actividad["id"]) {
        if (actividad["nuevo"]) {
          this.listaActividades.splice(n, 1);  
        }else{
          this.listaActividadesEliminadas.push(actividad["id"]);
          this.listaActividades.splice(n, 1);
        }
        
        this.openSnackBar("Actividad eliminada", "Cerrar");      
        break;
      }
      n++;
    }
    console.log(this.listaActividades);
    console.log(this.listaActividadesEliminadas);
  }

  obtenerTipoActividad(tipo: number){
    //console.log("Tipo actividad:"+tipo);
    switch (tipo) {
      case 0:
        return "Libre";  
        
      case 1:
        //console.log("Entra aqui");
        return "General";  
        
      case 2:
        return "Especial de pago";  
        
      default:
          //console.log("Entra a default");
        break;
    }
  }

  obtenerTipoEvento(tipo: String){
    if (tipo === "L") {
      return "Libre";
    }
  }

  //Actualizar evento
  acuralizarEvento(){
    console.log(this.evento);
    this.eventoService.updateEvento(this.evento)
      .subscribe(res =>{
        console.log(res);
        this.openSnackBar("Informacion actualizada", "Cerrar");
        
      });
  }
  
  actualizarActividades(){
    var contUpdate = 0;
    for (const actividad of this.listaActividades) {
      //console.log(actividad);
      if (actividad["nuevo"]) {
        //console.log(actividad["actividad"]);
        this.actividadService.postActividad(actividad["actividad"])
        .subscribe(res => {
          console.log(res);
          actividad["nuevo"] = false;
        }); 
      }else if(actividad["actualizar"]) {
        contUpdate++;
        //console.log("Entra a acualizar")
        
      }
    }
    var contador = 0;
    for (const actividad of this.listaActividades) {
      this.actividadService.updateActividad(actividad['id'], actividad['actividad'])
        .subscribe(res => {
          console.log(res);
          contador++;
          if (contUpdate == contador) {
            this.obtenerActividades(this.evento._id);
            this.fGuardado = false;  
          }
        });
    }

    for (const id of this.listaActividadesEliminadas) {
      this.actividadService.deleteActividad(id)
        .subscribe(res => {
          console.log(res);
          this.obtenerActividades(this.evento._id);
        });
    }
    if (this.listaActividadesEliminadas.length > 0) {
      this.listaActividadesEliminadas = [];
    }


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

  backClicked(){
    this.locacion.back();
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
