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

    facturacion = true;
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
    
    
    //---datos extra

    cve_medico : string = "";
    nombre_medico : string = "";

    //---datos Paciente 1         

    nombre_paciente_1 : string = "";
    cubre_1 : string = "";
    edad_anyos_paciente_1 : string = "";
    edad_meses_paciente_1 : string = "";
    fecha_recompra_paciente_1 : string = "";
    fecha_nacimiento_paciente_1 : string = "";
    receta_paciente_1 = true;
    docis_paciente_1 : string = "";
    cartucho_paciente_1 : string = "";
    compra_paciente_1 : string = "";
    cubre_total_paciente_1 : string = "";
    presetnacion_paciente_1 : string = "";
    prodcuto_paciente_1 : string = "";

    //---datos Paciente 2
    nombre_paciente_2 : string = "";
    cubre_2 : string = "";
    edad_anyos_paciente_2 : string = "";
    edad_meses_paciente_2 : string = "";
    fecha_recompra_paciente_2 : string = "";
    fecha_nacimiento_paciente_2 : string = "";
    receta_paciente_2 = true;
    docis_paciente_2 : string = "";
    cartucho_paciente_2 : string = "";
    compra_paciente_2 : string = "";
    cubre_total_paciente_2 : string = "";
    presetnacion_paciente_2 : string = "";
    prodcuto_paciente_2 : string = "";


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

}