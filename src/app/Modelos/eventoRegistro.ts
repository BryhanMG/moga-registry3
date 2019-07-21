export class EventoRegistro{
    _id:  String = '';
    nombre_er: String = '';
    fecha_i: String = '';
    fecha_f: String = '';
    descripcion: String = '';
    estado: String = '';
    tipo: String = '';
    monto: String = '';
    campos: any[];
    categorias: any[];
    
    constructor(){
        this._id= '';
        this.nombre_er = '';
        this.fecha_i = '';
        this.fecha_f = '';
        this.descripcion = '';
        this.estado = '';
        this.tipo = '';
        this.monto = '';
        this.campos=[];
        this.categorias=[];
    }
}

