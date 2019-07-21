import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EventoRegistro } from "src/app/Modelos/eventoRegistro"
import { Hostip } from "src/app/Modelos/hostip";

@Injectable({
  providedIn: 'root'
})
export class RegistroService {
  localhost = Hostip;
  //localhost = "192.168.1.11";
  //localhost = "192.168.43.116";
  readonly URL_API_EVENTO = 'http://'+this.localhost+'/api/eventos_r';

  conteo: number;

  constructor(private http: HttpClient) { }

  //Obtener todos los eventos de registro
  getEventos(){
    return this.http.get(this.URL_API_EVENTO+'/get_all/');
  }

  //Obtener un evento especifico
  getEvento(id: String){
    return this.http.get(this.URL_API_EVENTO+`/get/${id}`);
  }

  //Obtener la cantidad de eventos existentes
  getEventosCount(){
    return this.http.get(this.URL_API_EVENTO+'/getcount/');
  }

  //Crear un nuevo evento
  postEvento(evento: EventoRegistro){
    return this.http.post(this.URL_API_EVENTO+'/create/', evento);
  }
  //Actualizar evento
  updateEvento(evento: EventoRegistro){
    return this.http.put(this.URL_API_EVENTO+`/update/${evento._id}`, evento);
  }

  //Actualizar estado del evento
  updateEstado(evento: EventoRegistro){
    return this.http.put(this.URL_API_EVENTO+`/estado/${evento._id}`, evento);
  }

  //Agregar un participante
  addParticipate(id:String, participantes: Object){
    console.log(participantes);
    return this.http.put(this.URL_API_EVENTO + `/add/${id}`, participantes);
  }

  //Eliminar participantes
  deleteParticipate(id:String, participantes: Object){
    console.log(participantes);
    return this.http.put(this.URL_API_EVENTO + `/quit/${id}`, participantes);
  }

  //Obtener un participante
  getParticipante(id: String, idP:String){
    return this.http.get(this.URL_API_EVENTO + `/get_p/${id}/${idP}`);
  }

  //Obtener un participante por boleta
  getParticipanteBoleta(id: String, idB:String){
    return this.http.get(this.URL_API_EVENTO + `/get_bo/${id}/${idB}`);
  }
}
