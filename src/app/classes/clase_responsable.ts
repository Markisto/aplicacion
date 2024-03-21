import { C_Direccion } from "./clase_direccion";

export class C_Responsable{
    cve_cliente = 0;
    cve_compania : string = "";
    cve_responsable : string = "";
    nombre : string ="";
    razon_social : string = "";
    rfc : string = "";
    calle_no : string = "";
    colonia : string = "";
    del_municipio : string = "";
    cp : string = "";
    cve_poblacion : string = "";
    telefono : string = "";
    telefono_2 : string = "";
    cve_clase_cte : string = "";
    cve_tipo_cte : string = "";
    c_uso_cfdi : string = "";
    c_regimen_fiscal : string = "";
    email : string = "";
    //---datos de entrega

    nombre_contacto ="";
    calle_numero_entrega = "";  
    codigo_postal_entrega = "";
    private direccion_entrega = new C_Direccion();
    poblacion_entrega = "";
    delegacion_entrega = "";
    colonia_entrega = "";

    facturacion = false;
    persona_fisica = true;
    persona_moral = false;
    //---datos de facturacion

    razon_social_facturacion = "";
    calle_facturacion = "";
    numero_exterior_facturacion = "";
    numero_interior_facturacion = "";
    codigo_postal_facturacion = "";
    private direccion_facturacion = new C_Direccion();
    poblacion_facturacion = "";
    delegacion_facturacion = "";
    colonia_facturacion = "";
    rfc_facturacion = "";
    uso_cfdi_facturacion = "";
    regimen_fiscal_facturacion = "";
    tipo_pago = "";
    
    fecha_recompra = "";
    
    //---datos extra

    cve_medico : string = "";
    nombre_medico : string = "";

    //---datos Paciente 1         

    nombre_paciente_1 : string = "";
    cubre_1 : string = "";
    pantalla_cubre_1 ="";
    edad_anyos_paciente_1 : string = "";
    edad_meses_paciente_1 : string = "";
  
    fecha_nacimiento_paciente_1 : string = "";

    docis_paciente_1 : number = 0;
    cartucho_paciente_1 : number = 0;
    compra_paciente_1 :number = 0;
    cubre_total_paciente_1 : number = 0;
    pantalla_cubre_total_1 = "";
    presetnacion_paciente_1 : string = "";
    producto_paciente_1 : string = "";
    cve_producto_paciente_1 : string = "";

    //---datos Paciente 2
    nombre_paciente_2 : string = "";
    cubre_2 : string = "";
    pantalla_cubre_2 ="";
    edad_anyos_paciente_2 : string = "";
    edad_meses_paciente_2 : string = "";
    
    fecha_nacimiento_paciente_2 : string = ""; 
    docis_paciente_2 : number = 0;
    cartucho_paciente_2 : number = 0;
    compra_paciente_2 : number = 0;
    cubre_total_paciente_2 : number = 0;
    pantalla_cubre_total_2 = "";
    presetnacion_paciente_2 : string = "";
    producto_paciente_2 : string = "";
    cve_producto_paciente_2 : string = "";


    folio_zaizen : string = "";


    set_direccion_entrega(dir : C_Direccion){
        this.direccion_entrega = dir;
        this.poblacion_entrega = dir.estado;
        this.delegacion_entrega = dir.municipio;
        this.colonia_entrega = dir.colonia_poblacion;
    }

    set_direccion_facturacion(dir : C_Direccion){   
        this.direccion_facturacion = dir;
        this.poblacion_facturacion = dir.estado;
        this.delegacion_facturacion = dir.municipio;
        this.colonia_facturacion = dir.colonia_poblacion;
    }

    set_cubre_1(){
        let carturho = Number(this.cartucho_paciente_1);
        
        let dosis = Number(this.docis_paciente_1);
        let cubre = carturho / dosis;
        this.cubre_1 = cubre.toString();
        this.pantalla_cubre_1 = this.cubre_1 + " Días";
    }

    set_cubre_total_1(){
        let cubre = Number(this.cubre_1);
        let compra = Number(this.compra_paciente_1);
        let cubre_total = cubre * compra;
        this.cubre_total_paciente_1 = cubre_total;
        this.pantalla_cubre_total_1 = this.cubre_total_paciente_1 + " Días"; 
    }

    set_cubre_2(){
        let carturho = Number(this.cartucho_paciente_2);
        
        let dosis = Number(this.docis_paciente_2);
        let cubre = carturho / dosis;
        this.cubre_2 = cubre.toString();
        this.pantalla_cubre_2 = this.cubre_2 + " Días";

    }

    set_cubre_total_2(){    
        let cubre = Number(this.cubre_2);
        let compra = Number(this.compra_paciente_2);
        let cubre_total = cubre * compra;
        this.cubre_total_paciente_2 = cubre_total;
        this.pantalla_cubre_total_2 = this.cubre_total_paciente_2 + " Días";

    }



}