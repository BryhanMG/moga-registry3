import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Actividad } from 'src/app/Modelos/actividad';
import { ActividadService } from 'src/app/Servicios/actividad.service';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/Modelos/user';
import { UserService } from 'src/app/Servicios/user.service';
import jsPDF from 'jspdf';
import { RegistroService } from 'src/app/Servicios/registro.service';
import { EventoRegistro } from 'src/app/Modelos/eventoRegistro';

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.css']
})
export class ReporteComponent implements OnInit {
  @ViewChild('informe', {static: true}) informe: ElementRef;
  userLogged: User;

  evento = new EventoRegistro();
  idActividad: string;
  actividad = new Actividad();
  fechaA = new Date();
  asistentesCat = [];
  constructor(
    private actividadService: ActividadService,
    private route: ActivatedRoute,
    private userService: UserService,
    private eventoService: RegistroService
  ) {
    this.idActividad = this.route.snapshot.paramMap.get('id');
    this.obtenerActividad();

  }

  ngOnInit() {
    this.userLogged = this.userService.getUserLoggedIn();
  }

  obtenerEvento(id){
    this.eventoService.getEvento(id)
      .subscribe(res =>{

        if (res != null) {
          this.evento = res as EventoRegistro;
          if (this.actividad.tipo == 1) {
            for (const cat of this.evento.categorias) {
              var ar = [];
              for (const a of this.actividad.asistentes) {
                if (cat === a['categoria']) {
                  ar.push(a);
                }
              }
              this.asistentesCat.push({nombre: cat, lista: ar});

            }

            var ar2 = [];
            for (const a of this.actividad.asistentes) {
              if (a['categoria'] == null ) {
                ar2.push(a);
              }
            }
            this.asistentesCat.push({nombre: 'Sin asignar', lista: ar2});

            console.log(this.asistentesCat);
          }
        }
      });
  }

  obtenerActividad(){
    this.actividadService.getActividad(this.idActividad)
      .subscribe(res => {
        this.actividad = res as Actividad;
        console.log(this.actividad);
        this.obtenerEvento(this.actividad.id_er);
      });
  }

  obtenerAsistentes(id, a){
    this.actividadService.getAsistentes(id)
      .subscribe(res => {
        //console.log(res);
        //console.log(res[0]['asistentes']);

        //console.log(this.listaActividades);

      });
  }


  tipoActividad(op){
    if(op == 1){
      return "General";
    }else if(op == 2){
      return "Especial de pago";
    }else{
      return "Libre acceso";
    }
  }

  obtenerMes(op: number){
    switch (op) {
      case 1:
          return "enero";
        break;
      case 2:
          return "febrero";
        break;
      case 3:
          return "marzo";
        break;
      case 4:
          return "abril";
        break;
      case 5:
          return "mayo";
        break;
      case 6:
          return "junio";
        break;
      case 7:
          return "julio";
        break;
      case 8:
          return "agosto";
        break;
      case 9:
          return "septiembre";
        break;
      case 10:
          return "octubre";
        break;
      case 11:
          return "noviembre";
        break;
      case 12:
          return "diciembre";
        break;
      default:
        break;
    }
  }

  descargarPDF(){
    let doc = new jsPDF({
      orientation: 'portrait',
      unit: 'in',
      format: [11, 8.5]
    });
    const id = this.actividad.nombre_a+"_"+this.actividad.id_er;
    //console.log(this.informe.nativeElement.offsetHeight);
    var options = {
      pagesplit: true
    };

    doc.addHTML(this.informe.nativeElement, options,function() {
      doc.save('informe_'+id+'.pdf');
      });

  }
}
