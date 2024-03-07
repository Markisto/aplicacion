export class C_Usuario{
    token: string ;
    cve_usuario: string;
    nombre: string;
    cve_sucursal : string;
    nombre_sesion : string ;

    constructor(token: string, cve_usuario: string, nombre: string, cve_sucursal: string , nombre_sesion: string){
        this.token = token;
        this.cve_usuario = cve_usuario;
        this.nombre = nombre;
        this.cve_sucursal = cve_sucursal;
        this.nombre_sesion = nombre_sesion;
    }

}