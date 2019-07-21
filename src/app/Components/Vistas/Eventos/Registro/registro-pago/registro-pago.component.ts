import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {MatDialog} from '@angular/material/dialog';

import { UsuarioService } from 'src/app/Servicios/usuario.service';
import { RegistroService } from 'src/app/Servicios/registro.service';
import { EventoRegistro } from 'src/app/Modelos/eventoRegistro';
import { NotificacionBoletaDialogComponent } from 'src/app/Components/Vistas/MisDialogs/notificacion-boleta-dialog/notificacion-boleta-dialog.component';

@Component({
  selector: 'app-registro-pago',
  templateUrl: './registro-pago.component.html',
  styleUrls: ['./registro-pago.component.css']
})
export class RegistroPagoComponent implements OnInit {
  idE: String;
  id: String;
  evento = new EventoRegistro();
  campos: any[];
  codigoQR: String= null;
  firstFormGroup= new FormGroup({
    id: new FormControl(''),
    nombres: new FormControl(''),
    apellidos: new FormControl(''),
    correo: new FormControl(''),
    boleta: new FormControl(''),
    categoria: new FormControl(''),
    fcategoria: new FormControl(''),
  });
  //Errores
  ferror = false; //error al buscar un usuario en el sistema
  ferror1 = false; //error al insertar numero de boleta
  ferror2 = false; //error al insertar un participante repetido

  constructor(private _formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private eventoService: RegistroService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    
    ) { 
      
    }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      id: ['', Validators.required],
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      correo: [''],
      boleta: ['', Validators.required],
      categoria: [''],
      fcategoria: [false],
    });
    this.idE = this.route.snapshot.paramMap.get('id');
    this.obtenerEvento(this.idE);
  }

  obtenerEvento(id: String){
    this.campos = [];
    this.eventoService.getEvento(id)
      .subscribe(res =>{
        this.evento = res as EventoRegistro;
        this.participantes = this.evento['participantes'];
        //console.log(this.participantes);
        for (const campo of this.evento.campos) {
          this.campos.push({campo: campo, valor: ''});
        }
      });
  }

  buscar(){
    this.usuarioService.getUsuario(this.id)
      .subscribe(res => {
        //console.log(res);
        if (res != null) {
          this.ferror = false;
          this.id=null;
          
          this.firstFormGroup.get('id').setValue(res["_id"]);
          this.firstFormGroup.get('nombres').setValue(res["nombres"]);
          this.firstFormGroup.get('apellidos').setValue(res["apellidos"]);
          this.firstFormGroup.get('correo').setValue(res["correo"]);
        }else{
          this.ferror = true;
        }
      });
  }
  
  participantes: any[];
  participante: Object;
  registrar(){
    if (this.firstFormGroup.valid) {
      if (!this.feditar) {
        this.ferror2 = false;
        this.ferror1 = false;
        for (const participante of this.participantes) {
          if (participante['_id'] === this.firstFormGroup.get('id').value) {
            this.ferror2 = true;
          }
          if (participante['boleta'] === this.firstFormGroup.get('boleta').value) {
            this.ferror1 = true;
            this.participante = participante;
          }
        }
        if (!this.ferror2) {

          if (!this.ferror1) {
            this.addParticipante();
          }
        }
      }else{
        //console.log({participantes: [this.participante]});
        
        this.eventoService.deleteParticipate(this.idE, {participantes: [this.participante]})
          .subscribe(res => {
            console.log(res);
            this.addParticipante();
          });
      }
    }
  }

  addParticipante(){
    var categoria = null;
    if (this.firstFormGroup.get('fcategoria').value) {
      categoria = this.firstFormGroup.get('categoria').value;
    }
    let pa = {participantes: [{
      _id: this.firstFormGroup.get('id').value,
      nombres: this.firstFormGroup.get('nombres').value,
      apellidos: this.firstFormGroup.get('apellidos').value,
      correo: this.firstFormGroup.get('correo').value,
      boleta: this.firstFormGroup.get('boleta').value,
      categoria: categoria
      }]};
    for (const campo of this.campos) {
      pa['participantes'][0][campo['campo']] = campo['valor'];  
    }
    //console.log(pa); 
    this.eventoService.addParticipate(this.idE, pa)
      .subscribe(res => {
        console.log(res);
        this.obtenerEvento(this.idE);
        this.limpiarCampos();
      });  
  }

  limpiarCampos(){
    this.ferror1 = false;
    this.ferror2 = false;
    this.feditar = false;
    this.firstFormGroup.get('id').setValue(null);
    this.firstFormGroup.get('nombres').setValue(null);
    this.firstFormGroup.get('apellidos').setValue(null);
    this.firstFormGroup.get('correo').setValue(null);
    this.firstFormGroup.get('boleta').setValue(null);
    this.firstFormGroup.get('categoria').setValue(null);
    this.firstFormGroup.get('fcategoria').setValue(false);
    for (const campo of this.campos) {
      campo['valor'] = '';  
    }
    this.limpiarCancelar = "Limpiar";
    this.registrarActualizar = "Registrar";
  }
  
  limpiarCancelar = "Limpiar";
  registrarActualizar = "Registrar";
  feditar = false;
  editarRegistro(participante: Object){
    console.log(participante);
    this.participante = participante;
    this.feditar = true;
    this.limpiarCancelar = "Cancelar";
    this.registrarActualizar = "Actualizar";
    this.firstFormGroup.get('id').setValue(participante['_id']);
    this.firstFormGroup.get('nombres').setValue(participante['nombres']);
    this.firstFormGroup.get('apellidos').setValue(participante['apellidos']);
    this.firstFormGroup.get('correo').setValue(participante['correo']);
    this.firstFormGroup.get('boleta').setValue(participante['boleta']);
    if (participante['categoria'] != null) {
      this.firstFormGroup.get('categoria').setValue(participante['categoria']);
      this.firstFormGroup.get('fcategoria').setValue(true);   
    }
    for (const campo of this.campos) {
      campo['valor'] = participante[campo['campo']];  
    }
  }

  errorDialog(op: number, participante: Object): void {
    let f0 = false;
    let f1 = false;
    let f2 = false;
    switch (op) {
      case 0:
        f0 = true;
        break;
      case 1:
        f1 = true;
        
        break;
      case 2:
        f2 = true;
        break;
    
      default:
        break;
    }
    const dialogRef = this.dialog.open(NotificacionBoletaDialogComponent, {
      data: {participante: participante, campos: this.campos,
        error: f0,
        info: f1,
        eliminar: f2 
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      //console.log({participantes: [participante]});
      if (result) {
        
        this.eventoService.deleteParticipate(this.idE, {participantes: [participante]})
          .subscribe(res => {
            console.log(res);
            this.obtenerEvento(this.idE);
          });
        //console.log(result);  
      }
    });
  }

  entrada: String="";
  busquedaRegistros(){
    var lista: any[];
    lista = [];
    if (this.entrada.length > 0) {
      for (const participante of this.evento['participantes']) {
        let clave: String = participante['_id'];
        let boleta: String = participante['boleta'];
        let nombre: String = participante['nombres'];
        if (clave.startsWith(this.entrada.toString()) || boleta.startsWith(this.entrada.toString()) || nombre.includes(this.entrada.toString())) {
          lista.push(participante);
        }
      }
      this.participantes = lista;
    }else{
      this.participantes = this.evento['participantes'];
    }
  }
  

  generarQR(){
    this.codigoQR = this.firstFormGroup.get('id').value;
    //console.log(this.codigoQR);
    
  }
}
