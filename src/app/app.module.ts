import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from "@angular/http";
import { ReactiveFormsModule } from '@angular/forms';
import { NgxQRCodeModule } from 'ngx-qrcode2';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './Components/Home/home/home.component';
import { MenuSidenavComponent } from './Components/Home/menu-sidenav/menu-sidenav.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material';
import { LoginComponent } from './Components/Home/login/login.component';
import { InformacionComponent } from "./Components/Vistas/Eventos/informacion/informacion.component";
import { CrearComponent } from './Components/Vistas/Eventos/crear/crear.component';
import { EditarComponent } from './Components/Vistas/Eventos/editar/editar.component';
import { ResumenComponent } from './Components/Vistas/Eventos/resumen/resumen.component';
import { RegistroParticipanteComponent } from './Components/Vistas/Eventos/Registro/registro-participante/registro-participante.component';
import { RegistroGeneralComponent } from './Components/Vistas/Registro/registro-general/registro-general.component';
import { AdministarUsuariosComponent } from './Components/Vistas/Usuarios/administar-usuarios/administar-usuarios.component';
import { RegistroPagoComponent } from './Components/Vistas/Eventos/Registro/registro-pago/registro-pago.component';
import { AutenticacionComponent } from './Components/Vistas/Eventos/Autenticacion/autenticacion/autenticacion.component';
import { RegistroEspecialComponent } from './Components/Vistas/Eventos/Registro/registro-especial/registro-especial.component';
import { AutenticacionPagoComponent } from './Components/Vistas/Eventos/Autenticacion/autenticacion-pago/autenticacion-pago.component';
import { ErrorLogoutComponent } from './Components/Errores/error-logout/error-logout.component';

//Dialogs
import { AddAdminDialogComponent } from './Components/Vistas/MisDialogs/add-admin-dialog/add-admin-dialog.component';
import { EliminarUsuarioDialogComponent } from './Components/Vistas/MisDialogs/eliminar-usuario-dialog/eliminar-usuario-dialog.component';
import { EliminarAdminDialogComponent } from './Components/Vistas/MisDialogs/eliminar-admin-dialog/eliminar-admin-dialog.component';
import { InfoAdministradorDialogComponent } from './Components/Vistas/MisDialogs/info-administrador-dialog/info-administrador-dialog.component';
import { CambiarPasswordDialogComponent } from './Components/Vistas/MisDialogs/cambiar-password-dialog/cambiar-password-dialog.component';
import { AddCamposDialogComponent } from './Components/Vistas/MisDialogs/add-campos-dialog/add-campos-dialog.component';
import { NotificacionBoletaDialogComponent } from './Components/Vistas/MisDialogs/notificacion-boleta-dialog/notificacion-boleta-dialog.component';
import { EliminarAsistenteLibreDialogComponent } from './Components/Vistas/MisDialogs/eliminar-asistente-libre-dialog/eliminar-asistente-libre-dialog.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MenuSidenavComponent,
    LoginComponent,
    InformacionComponent,
    CrearComponent,
    EditarComponent,
    ResumenComponent,
    RegistroParticipanteComponent,
    RegistroGeneralComponent,
    EliminarUsuarioDialogComponent,
    AdministarUsuariosComponent,
    AddAdminDialogComponent,
    EliminarAdminDialogComponent,
    InfoAdministradorDialogComponent,
    CambiarPasswordDialogComponent,
    AddCamposDialogComponent,
    RegistroPagoComponent,
    AutenticacionComponent,
    NotificacionBoletaDialogComponent,
    RegistroEspecialComponent,
    AutenticacionPagoComponent,
    ErrorLogoutComponent,
    EliminarAsistenteLibreDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpModule,
    NgxQRCodeModule,
  ],
  entryComponents:[
    EliminarUsuarioDialogComponent,
    AddAdminDialogComponent,
    EliminarAdminDialogComponent,
    InfoAdministradorDialogComponent,
    CambiarPasswordDialogComponent,
    AddCamposDialogComponent,
    NotificacionBoletaDialogComponent,
    EliminarAsistenteLibreDialogComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
