export abstract class CrearEdit{

    obtenerFecha(fecha: Date, horaI: any): string{
        let fI = fecha;
        var fechaI : string;
        //console.log("FeI: "+fI);
        fI.setMonth(fI.getMonth()+1);
        if (fI.getMonth() < 10) {
            fechaI = fI.getFullYear()+"-0"+fI.getMonth();  
        }else{
            fechaI = fI.getFullYear()+"-"+fI.getMonth();
        }
        
        if (fI.getDate() < 10) {
            fechaI +="-0"+fI.getDate();   
        }else{
            fechaI += "-"+fI.getDate();   
        }
        
        fechaI+="T"+horaI+":00.000+00:00"
        console.log("Fecha Obtenida: "+fechaI);
        return fechaI;
    }

    

    //Generador de codigo aleatorio para las maquinas
    generadorClave(){
        var caracteres = "abcdefghijkmnpqrtuvwxyzABCDEFGHIJKLMNPQRTUVWXYZ2346789";
        var contraseña = "";
        for (let i = 0; i < 10; i++) {
        contraseña += caracteres.charAt(Math.floor(Math.random()*caracteres.length));
        }
        return contraseña;
    }
}