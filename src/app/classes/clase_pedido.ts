import { C_Productos } from "./clase_productos";

export class C_Pedido{
    cve_compañia : string = "";
    cve_sucursal : string = "";
    cve_folio : number = 0;
    cve_cliente : string = "";
    rfc : string = "";
    razon_social : string = "";
    cve_vendedor : string = "";
    cve_usuario : string = "";
    tipo_pago : string = "";
    uso_cfdi : string = "";
    tipo_envio : string = "";
    fecha_envio : string = "";
    nuevo_recompra : string = "";



    tipo_cliente : string = "";


    factura : boolean = true;
    aplicar_envio  = false;
    costo_envio : number = -1;

    productos_pedir : C_Productos[] = [];

    paciente_select : string = "";
    cubre_select : string = "";

    constructor(cve_folio : number ){
        this.cve_folio = cve_folio;
    }

}
