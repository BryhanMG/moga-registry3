import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { RegistroService } from 'src/app/Servicios/registro.service';
import { EventoRegistro } from 'src/app/Modelos/eventoRegistro';
import { ActividadService } from 'src/app/Servicios/actividad.service';
import { Actividad } from 'src/app/Modelos/actividad';
import { ActivatedRoute } from '@angular/router';

import jsPDF from 'jspdf';
import 'jspdf-autotable';

import { User } from 'src/app/Modelos/user';
import { UserService } from 'src/app/Servicios/user.service';

@Component({
  selector: 'app-informe',
  templateUrl: './informe.component.html',
  styleUrls: ['./informe.component.css']
})
export class InformeComponent implements OnInit {
  @ViewChild('informe', {static: true}) informe: ElementRef;
  userLogged: User;

  entrada: String;
  lugar: String = "----------";

  idEvento: string;

  evento = new EventoRegistro();
  listaActividades = [];
  fecha = new Date();
  fechaA = new Date();

  constructor(private eventoService: RegistroService,
    private actividadService: ActividadService,
    private route: ActivatedRoute,
    private userService: UserService,) {
      this.idEvento = this.route.snapshot.paramMap.get('id');
      this.obtenerEvento(this.idEvento);
      this.obtenerActividades(this.idEvento);
    }

  ngOnInit() {
    this.userLogged = this.userService.getUserLoggedIn();
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

  autenticado(f: boolean){
    if (f) {
      return "X";
    }else{
      return "";
    }
  }


  guardarLocalidad(){
    this.lugar = this.entrada;
    this.entrada = null;
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

  tipoEvento(op){
    if(op === 'L'){
      return "Libre acceso";
    }else{
      return "De paga";
    }
  }

  tipoActividad(op){
    if(op == 1){
      return "General";
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

    var logo = new Image();
    logo.src = '../../../../../assets/imgs/MOGA_registry_logo.png';
    
    doc.addImage(logo, 'png', 0.7, 0.7, 2, 1);
    doc.setFontSize(12);
    var fe = this.lugar+', fecha del evento '+this.fecha.getDate()+' de '+this.obtenerMes(this.fecha.getMonth())+' del '+this.fecha.getFullYear();
    var fa = null;
    var fb = null;
    
    if (fe.charAt(36) != ' ') {
      if (fe.charAt(35) === ' ') {//forma 'de a'
        fa = fe.substring(0, 36);
        fb = fe.substring(36);  
      }else if (fe.charAt(35) != ' ') {//forma 'agosto '
        var n = 0;
        for (let i = 37; i < fe.length; i++) {
          if (fe.charAt(i) === ' ') {
            break;
          }
          n++;
        }
        fa = fe.substring(0, 37+n);
        fb = fe.substring(38+n);
      }
    }else{
      fa = fe.substring(0, 37);
      fb = fe.substring(37);
    }
    
    doc.text(fa, 4.7, 0.7);
    doc.text(fb, 4.7, 0.9);

    doc.text('Este informe presenta los resultados del evento.', 0.7, 2);
    doc.setFontSize(10);
    doc.text('Código del evento: '+this.idEvento, 0.7, 2.3);
    doc.text('Nombre del evento: '+this.evento.nombre_er, 0.7, 2.5);
    doc.text('Tipo de evento: '+this.tipoEvento(this.evento.tipo), 0.7, 2.7);
    if (this.evento.tipo === 'P')doc.text('Monto: Q'+this.evento.monto, 4.3, 2.7);   
    doc.text('Fecha y hora de inicio: '+this.evento.fecha_i.substring(0, 10)+' ---- '+this.evento.fecha_i.substring(11, 16)+' Hrs.', 0.7, 2.9);
    doc.text('Fecha y hora de finalización: '+this.evento.fecha_f.substring(0, 10)+' ---- '+this.evento.fecha_f.substring(11, 16)+' Hrs.', 4.3, 2.9);

    var y = 3.1;
    
    
      
    if (this.evento.tipo === "P") {
      for (const ac of this.listaActividades) {
        doc.setFontSize(12);  
        doc.text(0.7,y, '------------------------------------------------');
        y+=0.2;
        
        doc.setFontSize(14);  
        doc.text('Actividad: '+ac.actividad.nombre_a, 0.7, y);
        doc.setFontSize(10);
        y+=0.2;
        if (ac.actividad.tipo == 2) {
          doc.text('Tipo: '+this.tipoActividad(ac.actividad.tipo), 0.7, y);
          doc.text('Monto: Q'+ac.actividad.monto, 4.3, y);
          y+=0.2;
        }
        doc.text('Fecha y hora inicio: '+ac.actividad.fecha_i.substring(0, 10)+' ---- '+ac.actividad.fecha_i.substring(11, 16)+' Hrs.', 0.7, y);
        doc.text('Fecha y hora fin: '+ac.actividad.fecha_f.substring(0, 10)+' ---- '+ac.actividad.fecha_f.substring(11, 16)+' Hrs.', 4.3, y);
        if (ac.actividad.tipo == 1) {
          y+=0.3;
          for (const cat of ac.asistentes) {
            doc.setFontSize(10);
            doc.text('Categoría: '+cat.nombre, 0.7, y);
            y+=0.1;
            var q= 0;
            var participantes = [];
            doc.setFontSize(12);
            for (const a of cat.lista) {
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
            if (y > 10.2) {
              y = y-10.2+0.7;
            }
          }
          //console.log(y);    
        }else{
          y+=0.1;
          console.log(ac.asistentes);
          var q= 0;
          var participantes = [];
          for (const a of ac.asistentes) {
            var nombre = a.nombres+' '+a.apellidos;
            var au = this.autenticado(a.autenticacion)
            participantes.push([a._id, nombre, a.correo, au]); 
            q+=0.4;  
          }
          doc.setFontSize(10);
          doc.autoTable({
            head: [['ID', 'Nombre', 'Correo', 'Autenticación']],
            body: participantes,
            startY: y,
            columnStyles: {0: {cellWidth: 1}, 1: {cellWidth: 1}, 2: {cellWidth: 1}, 3: {cellWidth: 1}}
          });

          y+=q+0.2;
          //console.log(y);
          if (y > 10.2) {
            y = y-10.2;
          }
          //console.log(y);
          
          
        }
      }

      doc.setFontSize(14);
      doc.text(0.7,y, 'Participantes inscritos al evento y autenticados en actividades de tipo General');
      y+=0.1
      var q= 0;
      var participantes = [];
      for (let p of this.evento['participantes']) {
        var nombre = p.nombres+' '+p.apellidos;
        participantes.push([p._id, nombre, p.correo]); 
        q+=0.4;
      }
      doc.setFontSize(10);
      doc.autoTable({
        head: [['ID', 'Nombre', 'Correo']],
        body: participantes,
        startY: y,
        columnStyles: {0: {cellWidth: 1}, 1: {cellWidth: 1}, 2: {cellWidth: 1}}
      });
      y+=q+0.2;
      if (y > 10.2) {
        y = y-10.2;
      }
      
    }else{
      for (let ac of this.listaActividades) {
        doc.setFontSize(12);  
        doc.text(0.7,y, '------------------------------------------------');
        y+=0.2;
        doc.text('Actividad: '+ac.actividad.nombre_a, 0.7, y)
        y+=0.2;
        doc.text('Fecha y hora inicio: '+ac.actividad.fecha_i.substring(0, 10)+' ---- '+ac.actividad.fecha_i.substring(11, 16)+' Hrs.', 0.7, y);
        doc.text('Fecha y hora fin: '+ac.actividad.fecha_f.substring(0, 10)+' ---- '+ac.actividad.fecha_f.substring(11, 16)+' Hrs.', 4.3, y);
        y+=0.1;
        var q= 0;
        var participantes = [];
        for (let a of ac.asistentes) {
          participantes.push([a.nombre, a.correo]);   
          q+=0.36;
        }
        doc.setFontSize(10);
        doc.autoTable({
          head: [['Nombre', 'Correo']],
          body: participantes,
          startY: y,
          columnStyles: {0: {cellWidth: 1}, 1: {cellWidth: 1}}
        });
        y+=q+0.2;
        if (y > 10.2) {
          y = y-10.2;
        }
      }
    }
    
    var pageCount = doc.internal.getNumberOfPages();
    for(let i = 0; i < pageCount; i++) { 
      doc.setPage(i); 
      doc.text(0.7,10.6, 'Responsable: '+this.userLogged.username);
      doc.text(5,10.6, 'Fecha de descarga: '+this.fechaA.getDate()+' de '+this.obtenerMes(this.fechaA.getMonth())+' del '+this.fechaA.getFullYear());
      if (pageCount > 1) {
        doc.text(4.2,10.7, doc.internal.getCurrentPageInfo().pageNumber + "/" + pageCount);  
      }
    }

    doc.save('a4.pdf');
  }

  /*
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
  */
}
