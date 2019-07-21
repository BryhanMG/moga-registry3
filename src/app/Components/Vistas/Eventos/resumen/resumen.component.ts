import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { RegistroService } from "src/app/Servicios/registro.service";
import { ActividadService } from "src/app/Servicios/actividad.service";
import {RelojService} from 'src/app/Servicios/reloj.service';

import { EventoRegistro } from 'src/app/Modelos/eventoRegistro';
import { ActividadNuevaLibre, Actividad } from "src/app/Modelos/actividad";

@Component({
  selector: 'app-resumen',
  templateUrl: './resumen.component.html',
  styleUrls: ['./resumen.component.css']
})
export class ResumenComponent implements OnInit, OnDestroy {
  evento = new EventoRegistro(); //evento que se esta creando
  listaActividades = [];
  tiempo: Date;
  idEvento: String='';
  estado: String;
  nombre_er: String;

  fechai: String;
  horai: String;
  fechaf: String;
  horaf: String;

  //Temporizadores
  private r1Subsciption;

  constructor(private reloj: RelojService,
    private route: ActivatedRoute,
    private eventoService: RegistroService,
    private actividadService: ActividadService,
    
    ) {
      
      this.r1Subsciption = this.reloj.time.subscribe((now: Date) => {
        this.tiempo = now;
        console.log("tiempo Resumen", this.tiempo);
        this.idEvento = this.route.snapshot.paramMap.get('id')
        this.comprobarActividadesEspera();
        this.obtenerEvento(this.idEvento);
      });
      
     }

  ngOnInit() {
    this.idEvento = this.route.snapshot.paramMap.get('id')
    this.obtenerEvento(this.idEvento);
    this.obtenerActividades(this.idEvento);
  }

  ngOnDestroy(): void {
    this.r1Subsciption.unsubscribe();
  }

  obtenerEvento(id){
    this.eventoService.getEvento(id)
      .subscribe(res =>{
        this.evento = res as EventoRegistro;
        if (this.evento) {
          this.estado = this.evento.estado;
          this.nombre_er = this.evento.nombre_er;  
          this.fechai = this.evento.fecha_i.substring(0, 10);
          this.horai = this.evento.fecha_i.substring(11, 16);
          this.fechaf = this.evento.fecha_f.substring(0, 10);
          this.horaf = this.evento.fecha_f.substring(11, 16);
        }
      });
  }

  obtenerActividades(id: String){
    //this.listaActividades = [];
    this.actividadService.getActividades(id)
      .subscribe(res => {
        var la = res as Actividad[];
        this.listaActividades = [];
        for (const a of la) {
          this.listaActividades.push({id: a._id, actividad: a});
        }
        this.comprobarActividadesEspera();
        //console.log(this.listaActividades);
      });
  }

  obtenerTipoEvento(tipo: String){
    if (tipo === 'L') {
      return "Libre";
    }else{
      return "De Pago";
    }
  }

  obtenerTipoActividad(tipo: number){
    if (tipo == 1) {
      return "General";
    }else{
      return "Especial de pago";
    }
  }

  comprobarActividadesEspera(){
    this.tiempo = new Date();
    if(this.listaActividades){
      for (const ac of this.listaActividades) {
        var fechaI = new Date(ac["actividad"]["fecha_i"].toString());
        var fechaF = new Date(ac["actividad"]["fecha_f"].toString());
        fechaI.setHours(fechaI.getHours()+6);
        fechaF.setHours(fechaF.getHours()+6);
        
        //console.log("Fecha inicial: ",fi);
        //console.log(fechaI," <= ", this.tiempo);
        //console.log(ff.valueOf()," >= ", this.tiempo.valueOf());
        if ( ac["actividad"]["estado"] === "E" && (fechaI <= this.tiempo && fechaF >= this.tiempo)) {
          ac["actividad"]["estado"] = "A";
          this.actividadService.updateActividad(ac["id"], ac["actividad"])
            .subscribe(res => {
              this.obtenerActividades(this.idEvento);
            });
        }else if ( (ac["actividad"]["estado"] === "E" || ac["actividad"]["estado"] === "A") && fechaF <= this.tiempo) {
          ac["actividad"]["estado"] = "T";
          this.actividadService.updateActividad(ac["id"], ac["actividad"])
            .subscribe(res => {
              this.obtenerActividades(this.idEvento);
            });
        }
      }
    }
  }

}
