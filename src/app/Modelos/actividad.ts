export class Actividad{
    _id:  String;
    id_er: String;
    nombre_a: String;
    fecha_i: String;
    fecha_f: String;
    descripcion: String;
    estado: String;
    tipo: number;
    monto:number;
    total: number;
    asistentes: Array<Object>;

    constructor(){
        this._id= '';
        this.id_er='';
        this.nombre_a = '';
        this.fecha_i = '';
        this.fecha_f = '';
        this.descripcion = '';
        this.estado = '';
        this.tipo=null;
        this.monto=null;
        this.total=null;
    }
}

export class ActividadNuevaLibre{
    id_er: String;
    nombre_a: String;
    fecha_i: String;
    fecha_f: String;
    descripcion: String;
    estado: String;
    tipo: number;
    
    constructor(id_er: String, nombre_a: String, fecha_i: String, fecha_f: String, descripcion: String, estado: String, tipo: number){
        this.id_er=id_er;
        this.nombre_a = nombre_a;
        this.fecha_i = fecha_i;
        this.fecha_f = fecha_f;
        this.descripcion = descripcion;
        this.estado = estado;
        this.tipo=tipo;
        
    }
}

export class ActividadNuevaPagada{
    id_er: String;
    nombre_a: String;
    fecha_i: String;
    fecha_f: String;
    descripcion: String;
    estado: String;
    tipo: number;
    monto: String;
    
    constructor(id_er: String, nombre_a: String, fecha_i: String, fecha_f: String, descripcion: String, estado: String, tipo: number, monto: String){
        this.id_er=id_er;
        this.nombre_a = nombre_a;
        this.fecha_i = fecha_i;
        this.fecha_f = fecha_f;
        this.descripcion = descripcion;
        this.estado = estado;
        this.tipo=tipo;
        this.monto=monto;
    }
}