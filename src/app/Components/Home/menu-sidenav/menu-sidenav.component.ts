import { Component, OnInit, OnDestroy } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';

import { UserService } from "src/app/Servicios/user.service";
import {Location} from '@angular/common';

import { User } from "src/app/Modelos/user";
import { UsuarioService } from 'src/app/Servicios/usuario.service';
import { CambiarPasswordDialogComponent } from '../../Vistas/MisDialogs/cambiar-password-dialog/cambiar-password-dialog.component';
import { AdministradorService } from 'src/app/Servicios/administrador.service';
import { Administrador } from 'src/app/Modelos/administrador';
import { Router } from '@angular/router';
import { RelojService } from 'src/app/Servicios/reloj.service';
import { RegistroService } from 'src/app/Servicios/registro.service';
import { EventoRegistro } from 'src/app/Modelos/eventoRegistro';
@Component({
  selector: 'app-menu-sidenav',
  templateUrl: './menu-sidenav.component.html',
  styleUrls: ['./menu-sidenav.component.css']
})
export class MenuSidenavComponent implements OnInit, OnDestroy {
  idUser: String;
  usuario: String;
  userLogged: User;
  showHome: boolean = true;
  tiempo: Date;

  shouldRun = [/(^|\.)plnkr\.co$/, /(^|\.)stackblitz\.io$/].some(h => h.test(window.location.host));

  //Temporizadores
  private r1Subsciption;
  private r2Subsciption;

  constructor(private locacion: Location,
    private userService: UserService,
    private usuarioService: UsuarioService,
    private administradorService: AdministradorService,
    public dialog: MatDialog,
    private router: Router,
    private reloj: RelojService,
    private eventoService: RegistroService,
    ) { 
      this.r1Subsciption = this.reloj.timeSecondSession.subscribe((now: Date) => {
        this.userLogged = this.userService.getUserLoggedIn();
        if (!this.userLogged) {
          this.router.navigateByUrl('/error-logout');
        }
        
      });

      this.r2Subsciption = this.reloj.time.subscribe((now: Date) => {
        this.tiempo = now;
        //console.log(now);
        this.comprobarEventosEspera();
      });

    }

  ngOnInit() {
    this.userLogged = this.userService.getUserLoggedIn();
    if (this.userLogged) {
      this.idUser = this.userLogged.username;
      this.obtenerUsuario(this.userLogged.username); 
    }
  }

  ngOnDestroy(): void {
    this.r1Subsciption.unsubscribe();
    this.r2Subsciption.unsubscribe();
  }

  obtenerUsuario(id: String){
    this.usuarioService.getUsuario(id)
      .subscribe(res => {
        if (res != null) {
          this.usuario = res['nombres'];  
        }
      });
    
  }

  changeShowHome(){
    console.log("Si cambia");
    this.showHome = false;
    
  }

  cerrarSesion(){
    this.userService.closeSession();
    this.router.navigateByUrl('/login');
  }

  //Dialog para cambiar la contraseña del usuario
  passwordDialog(): void {
    
    const dialogRef = this.dialog.open(CambiarPasswordDialogComponent, {
      data: {idUser: this.idUser
        }
    });

    dialogRef.afterClosed().subscribe(result => {
      
    });
  }

  comprobarEventosEspera(){
    this.eventoService.getEventos()
      .subscribe(res => {
        var listaOpcion = res as EventoRegistro[];
        //console.log(listaOpcion);
        if(listaOpcion){
          for (const ev of listaOpcion) {
            var fechaI = new Date(ev.fecha_i.toString());
            var fechaF = new Date(ev.fecha_f.toString());
            fechaI.setHours(fechaI.getHours()+6);
            fechaF.setHours(fechaF.getHours()+6);
            if ( ev.estado === "E" && (fechaI <= this.tiempo && fechaF >= this.tiempo)) {
              ev.estado = "A";
              this.eventoService.updateEstado(ev)
                .subscribe(res => {
                  console.log(res);
                });
            }else if ( (ev.estado === "A" || ev.estado === "E") && fechaF <= this.tiempo) {
              ev.estado = "T";
              this.eventoService.updateEstado(ev)
                .subscribe(res => {
                  console.log(res);
                });
            }
          }
        }
      });
    
    
    
  }
}
