import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Actividad } from 'src/app/Modelos/actividad';
import { ActividadService } from 'src/app/Servicios/actividad.service';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/Modelos/user';
import { UserService } from 'src/app/Servicios/user.service';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
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
          if (this.actividad.tipo == 1 || this.actividad.tipo == 2) {
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

            //console.log(this.asistentesCat);
          }
        }
      });
  }

  obtenerActividad(){
    this.actividadService.getActividad(this.idActividad)
      .subscribe(res => {
        this.actividad = res as Actividad;
        //console.log(this.actividad);
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

    var logo = new Image();
    logo.src = '../../../../../assets/imgs/MOGA_registry_logo.png';
    //console.log(logo);
    doc.addImage(logo, 'png', 0.7, 0.7, 2, 1);
    doc.setFontSize(12);
    doc.text('Este reporte presenta la información de la actividad.', 0.7, 2);
    doc.setFontSize(10);
    doc.text('Código del evento: '+this.actividad.id_er, 0.7, 2.4);
    doc.text('Nombre de la actividad: '+this.actividad.nombre_a, 0.7, 2.6);
    doc.text('Tipo de actividad: '+this.tipoActividad(this.actividad.tipo), 0.7, 2.8);
    if (this.actividad.tipo == 2) doc.text('Monto: Q'+this.actividad.monto, 4.3, 2.8);
    doc.text('Fecha y hora de inicio: '+this.actividad.fecha_i.substring(0, 10)+' ---- '+this.actividad.fecha_i.substring(11, 16)+' Hrs.', 0.7, 3);
    doc.text('Fecha y hora de finalización: '+this.actividad.fecha_f.substring(0, 10)+' ---- '+this.actividad.fecha_f.substring(11, 16)+' Hrs.', 4.3, 3);

    var y = 3.3;
    if (this.actividad.tipo == 0) {
      var q= 0;
      var participantes = [];
        for (let a of this.actividad.asistentes) {
          participantes.push([a['nombre'], a['correo']]);
          q+=0.5;
        }
        doc.autoTable({
          head: [['Nombre', 'Correo']],
          body: participantes,
          startY: y,
          columnStyles: {0: {cellWidth: 0.6}, 1: {cellWidth: 1}}
        });
        y+=q+0.2;
        if (y > 10) {
          y = y-10+0.7;
        }
    }else{
      for (let cat of this.asistentesCat) {
        doc.setFontSize(14);
        doc.text('Categoría: '+cat.nombre, 0.7, y);
        doc.setFontSize(10);
        var participantes = [];
        y+=0.1;
        var q= 0;
        for (let a of cat.lista) {
          var nombre = a.nombres+' '+a.apellidos;
          participantes.push([a._id, nombre, a.correo]);
          q+=0.5;
        }
        doc.autoTable({
          head: [['ID', 'Nombre', 'Correo']],
          body: participantes,
          startY: y,
          
          columnStyles: {0: {cellWidth: 0.6}, 1: {cellWidth: 1}, 2: {cellWidth: 1}}
        });
        y+=q+0.2;
        if (y > 10) {
          y = y-10+0.7;
        }
      }
    }
    
    
    var pageCount = doc.internal.getNumberOfPages();
    for(let i = 0; i < pageCount; i++) { 
      doc.setPage(i); 
      doc.text(0.7,10.5, 'Responsable: '+this.userLogged.username);
      doc.text(5,10.5, 'Fecha de descarga: '+this.fechaA.getDate()+' de '+this.obtenerMes(this.fechaA.getMonth())+' del '+this.fechaA.getFullYear());
      if (pageCount > 1) {
        doc.text(4.2,10.7, doc.internal.getCurrentPageInfo().pageNumber + "/" + pageCount);  
      }
    }
    const id = this.actividad.nombre_a+"_"+this.actividad.id_er;
    doc.save('informe_'+id+'.pdf');
  }
  /*
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

  }*/
}
