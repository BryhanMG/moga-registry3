import { Component, OnInit, OnDestroy } from '@angular/core';

import { EventoRegistro } from "src/app/Modelos/eventoRegistro";

import { RegistroService } from "src/app/Servicios/registro.service";
import {RelojService} from 'src/app/Servicios/reloj.service';

import { UserService } from 'src/app/Servicios/user.service';

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
  userLogged: UserService;

  //Temporizadores
  private r1Subsciption;

  constructor(private reloj: RelojService,
    private eventoService: RegistroService,
    private userService: UserService
    ) { 
      
      /*
      this.r1Subsciption = this.reloj.time.subscribe((now: Date) => {
        this.tiempo = now;
        //console.log("tiempo", this.tiempo);
        //this.evaluarEventos();
      });*/
      
    }

  ngOnInit() {
    this.getEventos();
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
}
