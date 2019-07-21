import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from "src/app/Components/Home/login/login.component";
import { MenuSidenavComponent } from "src/app/Components/Home/menu-sidenav/menu-sidenav.component";
import { HomeComponent } from "src/app/Components/Home/home/home.component";
import { InformacionComponent } from "src/app/Components/Vistas/Eventos/informacion/informacion.component";
import { CrearComponent } from "src/app/Components/Vistas/Eventos/crear/crear.component";
import { EditarComponent } from "src/app/Components/Vistas/Eventos/editar/editar.component";
import { ResumenComponent } from "src/app/Components/Vistas/Eventos/resumen/resumen.component";
import { RegistroParticipanteComponent } from "src/app/Components/Vistas/Eventos/Registro/registro-participante/registro-participante.component";
import { RegistroGeneralComponent } from './Components/Vistas/Registro/registro-general/registro-general.component';
import { AdministarUsuariosComponent } from './Components/Vistas/Usuarios/administar-usuarios/administar-usuarios.component';
import { RegistroPagoComponent } from './Components/Vistas/Eventos/Registro/registro-pago/registro-pago.component';
import { AutenticacionComponent } from './Components/Vistas/Eventos/Autenticacion/autenticacion/autenticacion.component';
import { RegistroEspecialComponent } from './Components/Vistas/Eventos/Registro/registro-especial/registro-especial.component';
import { AutenticacionPagoComponent } from './Components/Vistas/Eventos/Autenticacion/autenticacion-pago/autenticacion-pago.component';
import { ErrorLogoutComponent } from './Components/Errores/error-logout/error-logout.component';


const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: '', redirectTo:'/login', pathMatch: 'full'},
  {path: 'moga', component: MenuSidenavComponent, 
    children:[
      {path: '', component: HomeComponent},
      {path: 'eventos', component: InformacionComponent},
      {path: 'resumen/:id', component: ResumenComponent},
      {path: 'registro-participante/:id', component: RegistroParticipanteComponent},
      {path: 'registro-pago/:id', component: RegistroPagoComponent},
      {path: 'registro-especial/:idE/:id', component: RegistroEspecialComponent},
      {path: 'autenticar/:id', component: AutenticacionComponent},
      {path: 'autenticar-pago/:id', component: AutenticacionPagoComponent},
      {path: 'registro', component: RegistroGeneralComponent},
      {path: 'usuarios', component: AdministarUsuariosComponent},
    ]},
  {path: 'crear', component: CrearComponent},
  {path: 'editar-evento/:id', component: EditarComponent},
  {path: 'error-logout', component: ErrorLogoutComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
