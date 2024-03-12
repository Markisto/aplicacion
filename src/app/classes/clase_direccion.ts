
export class C_Direccion{
    cve_estado = 0;
    codigo_postal = "";
    colonia_poblacion = "";
    municipio = "";
    estado = "";
    index = 0;



    get_pantalla(){
        return this.colonia_poblacion + ", " + this.municipio + ", " + this.estado;
    }

}