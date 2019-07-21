import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Administrador } from '../Modelos/administrador';
import { Hostip } from "src/app/Modelos/hostip";

@Injectable({
  providedIn: 'root'
})
export class AdministradorService {
  readonly URL_API = 'http://'+Hostip+'/api/admins_reg';
  admin: Administrador;
  admins: Administrador[];

  constructor(private http: HttpClient) { }

  //Obtener todos los administradores
  getAdministradores(){
    return this.http.get(this.URL_API + `/get_all/`);
  }

  //Obtener administrador especifico
  getAdministrador(id: String){
    return this.http.get(this.URL_API + `/get/${id}`);
  }

  //crear un nuevo administrador
  postAdministrador(admin: Object){
    return this.http.post(this.URL_API + `/create/`, admin);
  }

  //Restablecer password administrador
  putAdministradorPass(admin: Object){
    return this.http.put(this.URL_API + `/update/${admin['_id']}`, admin);
  }

  //Eliminar administrador
  deleteAdministrador(id: String){
    return this.http.delete(this.URL_API + `/delete/${id}`);
  }
}
