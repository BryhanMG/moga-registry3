import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActividadNuevaLibre, Actividad } from '../Modelos/actividad';
import { Hostip } from "src/app/Modelos/hostip";

@Injectable({
  providedIn: 'root'
})
export class ActividadService {
  
  //localhost = "192.168.1.11";
  //localhost = "192.168.43.116";
  readonly URL_API_EVENTO = Hostip+'/api/actividades';

  constructor(private http: HttpClient,
    ) { }

  //Obtener actividades
  getActividades(id: String){
    return this.http.get(this.URL_API_EVENTO+`/getall/${id}`);
  }

  getActividad(id: String){
    return this.http.get(this.URL_API_EVENTO+`/get/${id}`);
  }

  //Crear actividad
  postActividad(actividad: ActividadNuevaLibre){
    return this.http.post(this.URL_API_EVENTO+"/create/", actividad);
  }

  //Eliminar actividad
  deleteActividad(id: String){
    return this.http.delete(this.URL_API_EVENTO+`/delete/${id}`);
  }
  
  //Actualizar actividad
  updateActividad(id: String, actividad: Actividad){
    return this.http.put(this.URL_API_EVENTO+`/update/${id}`, actividad);
  }

  //Obtener asistentes de una actividad especifica
  getAsistentes(id: String){
    return this.http.get(this.URL_API_EVENTO+`/getall-P/${id}`);
  }

  //Agregar un participante
  putAsistente(id:String,  asistente: Object){
    //console.log(asistente['asistentes']);
    return this.http.put(this.URL_API_EVENTO+`/add/${id}`, asistente);
  }

  //Eliminar un participante
  deleteAsistente(id:String,  asistente: Object){
    return this.http.put(this.URL_API_EVENTO+`/quit/${id}`, asistente);
  }

  
}
