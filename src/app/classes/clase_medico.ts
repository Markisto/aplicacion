import { C_Direccion } from "./clase_direccion";

export  class C_Medico{
    Cve_Medico ="";
    Nombre ="";
    Telefono1 =""; 
    Telefono2 =""; 
    email =""; 

    CalleNumero =""; 
    Colonia =""; 
    Estado =""; 
    Poblacion = ""; 
    CP =""; 

    CalleNumero2 =""; 
    Colonia2 =""; 
    Estado2 =""; 
    Poblacion2 =""; 
    CP2 =""; 

    consultorio =""; 
    cedula =""; 
    horario =""; 
    Status =""; 

    Cve_Vendedor ="";




    set_direccion_1(dir : C_Direccion){
       
        this.Poblacion = dir.estado;
        this.Estado = dir.municipio;
        this.Colonia = dir.colonia_poblacion;
    }

    set_direccion_2(dir : C_Direccion){
        this.Poblacion2 = dir.estado;
        this.Estado2 = dir.municipio;
        this.Colonia2 = dir.colonia_poblacion;
    }

} 