import { Component, OnInit, OnDestroy } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';

import { EventoRegistro } from "src/app/Modelos/eventoRegistro";

import { RegistroService } from "src/app/Servicios/registro.service";
import {RelojService} from 'src/app/Servicios/reloj.service';

import { UserService } from 'src/app/Servicios/user.service';
import { TerminarEventoDialogComponent } from '../../MisDialogs/terminar-evento-dialog/terminar-evento-dialog.component';
import { ActividadService } from 'src/app/Servicios/actividad.service';
import { Actividad } from 'src/app/Modelos/actividad';
import { User } from 'src/app/Modelos/user';
import { AdministradorService } from 'src/app/Servicios/administrador.service';

@Component({
  selector: 'app-informacion',
  templateUrl: './informacion.component.html',
  styleUrls: ['./informacion.component.css']
})
export class InformacionComponent implements OnInit, OnDestroy {
  listaEventos: EventoRegistro[];
  totalEventos: EventoRegistro[];
  listaOpcion: EventoRegistro[];
  estado="";
  mostrar="Z";
  entrada="";
  tiempo: Date;
  userLogged: User;

  //Temporizadores
  private r1Subsciption;

  constructor(private reloj: RelojService,
    private eventoService: RegistroService,
    private userService: UserService,
    private adminService: AdministradorService,
    public dialog: MatDialog,
    private actividadService: ActividadService,
    ) { 
      
      /*
      this.r1Subsciption = this.reloj.time.subscribe((now: Date) => {
        this.tiempo = now;
        //console.log("tiempo", this.tiempo);
        //this.evaluarEventos();
      });*/
      
    }

  ngOnInit() {
    
    this.actualizar();       
  }

  actualizar(){
    this.listaEventos = [];
    this.listaOpcion = [];
    this.totalEventos = [];

    this.userLogged = this.userService.getUserLoggedIn();
    //console.log(this.userLogged);
    if (this.userLogged.tipo == 2) {
      this.adminService.getEventosAE(this.userLogged.username)
        .subscribe(res => {
          if (res) {
            //console.log(res[0]['eventos']);
            for (const evt of res[0]['eventos']) {
              this.getEventosAdminEspecial(evt);
            }
          }
        });
    }else{
      this.getEventos();
    }
  }

  ngOnDestroy(): void {
    //this.r1Subsciption.unsubscribe();
  }

  getEventos(){
    this.eventoService.getEventos()
      .subscribe(res =>{
        this.listaEventos = res as EventoRegistro[];
        this.listaOpcion = res as EventoRegistro[];
        this.totalEventos = res as EventoRegistro[];
        //console.log(this.listaEventos);
      });
  }

  getEventosAdminEspecial(id: String){
    this.eventoService.getEvento(id)
      .subscribe(res =>{
        let eve= res as EventoRegistro;
        this.listaEventos.push(eve)
        this.listaOpcion.push(eve);
        this.totalEventos.push(eve);
        //console.log(this.listaEventos);
      });
  }

  indentificarEstado(estado: string): String{
    this.estado = estado;
    if (estado === "A") {
      return "A";
    }
    return "N";
  }

  opcionMostrar(){
    //console.log("opcion: "+this.mostrar);
    var lista = [];
    if(this.mostrar === 'Z'){
      this.listaEventos = this.listaOpcion;
    }else{
      for (const ev of this.listaOpcion) {
        //console.log("estado A: "+ev.estado + " estado B: "+this.mostrar);

        if (this.mostrar === ev.estado) {
          lista.push(ev);
        }
      }
      this.listaEventos = lista;
    }
    //console.log(lista);
  }

  buscar(){
    var lista = [];
    for (const ev of this.listaOpcion) {
      //console.log(ev.nombre_er);
      //console.log(this.entrada);
      if (ev.nombre_er.startsWith(this.entrada) || ev._id.startsWith(this.entrada)) {
        lista.push(ev);
      }
    }
    this.listaEventos = lista;
  }

  
  fcambio = false;
  evaluarEventos(){//Verificador de cambios en el evento
    this.eventoService.getEventos()
      .subscribe(res => {
        this.listaOpcion = res as EventoRegistro[];
        //console.log(this.listaOpcion[0]["nombre_er"]);
        //console.log(this.listaOpcion);
        //console.log(this.listaOpcion.length+ " == "+ this.totalEventos.length);
        if ((this.listaOpcion != null && this.totalEventos != null) && this.listaOpcion.length == this.totalEventos.length) {
          for (const ev of this.listaOpcion) {
            for (const e of this.totalEventos) {
              if (ev._id === e._id) {
                if (ev.nombre_er != e.nombre_er || ev.monto != e.monto || ev.fecha_i != e.fecha_i || ev.fecha_f != e.fecha_f
                   || ev.descripcion != e.descripcion ) {
                 //console.log("Si entra");
                 this.fcambio = true;

                }
              }
            }
          }  

          if (this.fcambio) {
            this.listaEventos = this.listaOpcion;
            this.totalEventos = this.listaOpcion;
          }
        }else{
          this.listaEventos = this.listaOpcion;
          this.totalEventos = this.listaOpcion;
        }
        
      });
  }

  tipoEvento(op: String){
    if (op === 'L') {
      return 'Libre';
    }else{
      return 'De pago';
    }
  }

  terminarEvento(evento: EventoRegistro){
    //console.log(this.evento);
    evento.estado = 'T';
    var f = new Date();
    f.setHours(f.getHours()-6);
    evento.fecha_f = f.toISOString();
    this.eventoService.updateTerminar(evento)
      .subscribe(res => {
        //console.log(res);
        this.actividadService.getActividades(evento._id)
          .subscribe(res => {
            var la = res as Actividad[];
            for (const actividad of la) {
              //console.log(actividad);  
              if (actividad["estado"] === "A" || actividad["estado"] === "E") {
                actividad["estado"] = "T";
                actividad["fecha_f"] = f.toISOString();
                this.actividadService.updateActividad(actividad["_id"], actividad)
                .subscribe(res => {
                  //console.log(res);
                });
              }
            }
          });
        
      });
      
  }

  //Dialog para terminar el evento
  terminarDialog(evento: EventoRegistro): void {
    const dialogRef = this.dialog.open(TerminarEventoDialogComponent, {
      data: {id: evento['_id'], nombre: evento['nombre_er']}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.terminarEvento(evento);
      }
    });
  }
}
