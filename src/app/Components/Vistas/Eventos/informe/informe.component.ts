import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { RegistroService } from 'src/app/Servicios/registro.service';
import { EventoRegistro } from 'src/app/Modelos/eventoRegistro';
import { ActividadService } from 'src/app/Servicios/actividad.service';
import { Actividad } from 'src/app/Modelos/actividad';
import { ActivatedRoute } from '@angular/router';

import jsPDF from 'jspdf';

@Component({
  selector: 'app-informe',
  templateUrl: './informe.component.html',
  styleUrls: ['./informe.component.css']
})
export class InformeComponent implements OnInit {
  @ViewChild('informe', {static: true}) informe: ElementRef;

  entrada: String;
  lugar: String = "----------";

  idEvento: string;

  evento = new EventoRegistro();
  listaActividades = [];
  fecha = new Date();

  constructor(private eventoService: RegistroService,
    private actividadService: ActividadService,
    private route: ActivatedRoute,) { 
      this.idEvento = this.route.snapshot.paramMap.get('id');
      this.obtenerEvento(this.idEvento);
      this.obtenerActividades(this.idEvento);
    }

  ngOnInit() {
  }

  obtenerEvento(id){
    this.eventoService.getEvento(id)
      .subscribe(res =>{
        
        if (res != null) {
          this.evento = res as EventoRegistro;
          this.fecha =  new Date(this.evento.fecha_f.toString());
          //console.log(this.evento);
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
          this.obtenerAsistentes(a._id, a);
        }     
        
      });

    
  }

  obtenerAsistentes(id, a){
    this.actividadService.getAsistentes(id)
      .subscribe(res => {
        //console.log(res);
        //console.log(res[0]['asistentes']);
        var asistentes = [];
        if (a.tipo == 1) {
          for (const cat of this.evento.categorias) {
            var ar = [];
            for (const a of res[0]['asistentes']) {
              if (cat === a.categoria) {
                ar.push(a);
              }
            }
            asistentes.push({nombre: cat, lista: ar});
            
          }

          var ar2 = [];
          for (const a of res[0]['asistentes']) {
            if (a.categoria == null ) {
              ar2.push(a);
            }
          }
          asistentes.push({nombre: 'Sin asignar', lista: ar2});
          this.listaActividades.push({id: id, actividad: a, asistentes: asistentes});
          //console.log(this.listaActividades[0]['asistentes']);  
        }else{
          this.listaActividades.push({id: id, actividad: a, asistentes: res[0]['asistentes']});
        }
        //console.log(this.listaActividades);  
        
      });
  }

  

  guardarLocalidad(){
    this.lugar = this.entrada;
    this.entrada = null;
  }

  obtenerMes(op: number){
    switch (op) {
      case 1:
          return "enero"
        break;
      case 2:
          return "febrero"
        break;
      case 3:
          return "marzo"
        break;
      case 4:
          return "abril"
        break;
      case 5:
          return "mayo"
        break;
      case 6:
          return "junio"
        break;
      case 7:
          return "julio"
        break;
      case 8:
          return "agosto"
        break;
      case 9:
          return "septiembre"
        break;
      case 10:
          return "octubre"
        break;
      case 11:
          return "noviembre"
        break;
      case 12:
          return "diciembre"
        break;
      default:
        break;
    }
  }

  tipoEvento(op){
    if(op === 'L'){
      return "Libre acceso";
    }else{
      return "De paga";
    }
  }

  tipoActividad(op){
    if(op == 1){
      return "Generla";
    }else{
      return "Especial de pago";
    }
  }

  descargarPDF(){
    let doc = new jsPDF({
      orientation: 'portrait',
      unit: 'in',
      format: [11, 8.5]
    });
    const id = this.idEvento;
    //console.log(this.informe.nativeElement.offsetHeight);
    var options = {
      pagesplit: true
    };
    
    doc.addHTML(this.informe.nativeElement, options,function() {
      doc.save('informe_'+id+'.pdf');
      });
    
  }
  
}
