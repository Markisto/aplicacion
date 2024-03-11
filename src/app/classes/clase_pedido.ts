import { C_Productos } from "./clase_productos";

export class C_Pedido{
    cve_compañia : string = "";
    cve_sucursal : string = "";
    nombre_sucursal : string = "";
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

    fecha_documento : string = "";
    status : string = "";

    nombre_pago_1 : string = "";
    nombre_pago_2 : string = "";

    fecha_pago_1 : string = "";
    fecha_pago_2 : string = "";

    id_pago_1 : string = "";
    id_pago_2 : string = "";

    imagen_pago_1 : File | any = null;
    imagen_pago_2 : File | any = null;



    constructor(cve_folio : number ){
        this.cve_folio = cve_folio;
    }

    resumen(){
        return `F: ${this.cve_folio} (${this.cve_sucursal}) ${this.nombre_sucursal} \n  ${this.razon_social} Capturado: ${this.fecha_documento}`;
    }

    number_productos(){
        return this.productos_pedir.length;
    }

    total_productos(){
        let total = 0;
        this.productos_pedir.forEach(p => {
            total += Number(p.sub_total);
        });
        return total;
    }

    total_envio(){
        let total = 0;
        this.productos_pedir.forEach(p =>{
            total += Number(p.envio);
        });
        return total;
    }

    mostrar_subir_pago(){

        if(this.status == 'CT' && (this.id_pago_1 == "" || this.id_pago_2 == "")){
            return true;
        }else{
            return false;
        }
    }

}
