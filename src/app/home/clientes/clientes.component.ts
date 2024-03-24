import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';


import { C_Pacientes } from '../../classes/clase_pacientes';
import { C_Responsable } from '../../classes/clase_responsable';
import { FormsModule } from '@angular/forms';
import { C_Direccion } from '../../classes/clase_direccion';
import { ClientesService } from './clientes.service';
import Swal from 'sweetalert2';
import { C_Usuario } from '../../classes/clase_usuario';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { C_Productos } from '../../classes/clase_productos';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule,FormsModule, MatAutocompleteModule, MatInputModule],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css'
})
export class ClientesComponent implements OnInit {
 

  user : C_Usuario = new C_Usuario("","","","","");
  vista = "consulta";
  pacientes : C_Pacientes[] = [];
  inittable = 1;
  ncliente = new C_Responsable();
 
  direcciones_entrega : C_Direccion[]=[];
  direcciones_facturacion : C_Direccion[]=[];  
  list_usos_cfdi : any[] = [];
  regimenes_fiscales : any[] = [];
  tipos_pago : any[] = [];
  clases_cliente : any[] = [];
  lista_medicos : any[] = [];

  productos_1 : C_Productos[] = [];
  productos_2 : C_Productos[] = [];
  btn_guardando = false;


  list_clientes : C_Responsable[] = []; 
  mcliente = new C_Responsable();
  modificar = false;
  muestra_btn_modificar = false;

  constructor(private service : ClientesService) {
    
   }

  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem("user") || "{}");
    console.log("user");
    console.log(this.user);
    this.Cargar_Usos_CFDI();
    this.Cargar_Regimenes_Fiscales();
    this.Cargar_Formas_Pago();
    this.Cargar_Clases_Cliente();
    this.Cargar_Medicos();
  }


  // ==========================================   FUNCIONES NUEVO CLIENTE ================================
  Nuevo_Cliente(){
    this.vista = "nuevo";
    this.ncliente.cve_cliente = 1;
    this.ncliente.persona_fisica = true;    
  }

  comp(tipo_persona : string){

    if(tipo_persona == "Fisica"){
      this.ncliente.persona_fisica = true;
      this.ncliente.persona_moral = false;
    }
    if(tipo_persona == "Moral"){
      this.ncliente.persona_fisica = false;
      this.ncliente.persona_moral = true;
    }
  }

  Cargar_Usos_CFDI(){
    this.list_usos_cfdi = [];
    this.service.Cargar_Usos_CFDI().subscribe({
      next: (res: any) => {
        if(res.code == 0){
          this.list_usos_cfdi = res.data;
          
        }
      },
      error: (err) => {
        Swal.fire({
          title: 'Error!',
          text: err.message,
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      },
    });
  }

  Cargar_Regimenes_Fiscales(){
    this.service.Cargar_Regimenes_Fiscales().subscribe({
      next: (res: any) => {
        if(res.code == 0){
          this.regimenes_fiscales = res.data;
          
        }
      },
      error: (err) => {
        Swal.fire({
          title: 'Error!',
          text: err.message,
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      },
    });
  }

  Cargar_Formas_Pago(){
    this.tipos_pago = [];
    this.service.Cargar_Formas_Pago().subscribe({
      next: (res: any) => {
        if(res.code == 0){
          this.tipos_pago = res.data;
          
        }
      },
      error: (err) => {
        Swal.fire({
          title: 'Error!',
          text: err.message,
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      },
    });
  }

  Cargar_Clases_Cliente(){
    this.clases_cliente = [];
    this.service.Cargar_Clases_Cliente().subscribe({
      next: (res: any) => {
        if(res.code == 0){
          this.clases_cliente = res.data;
          
        }
      },
      error: (err) => {
        Swal.fire({
          title: 'Error!',
          text: err.message,
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      },
    });
  }

  Cargar_Medicos(){
    this.service.Cargar_Medicos(this.user.cve_usuario).subscribe({
      next: (res: any) => {
        if(res.code == 0){
          this.lista_medicos = res.data;          
        }
      },
      error: (err) => {
        Swal.fire({
          title: 'Error!',
          text: err.message,
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      },

    });
  }

  Buscar_Dir_Entrega(){
    this.direcciones_entrega = [];
    this.service.Obtener_Direcciones(this.ncliente.codigo_postal_entrega).subscribe({
      next: (res: any) => {
        if(res.code == 0){
          let data = res.data;
          for(let i = 0; i < data.length; i++){
            let dir = new C_Direccion();
            dir.cve_estado = data[i].Cve_Estado;
            dir.codigo_postal = data[i].c_CodigoPostal;
            dir.colonia_poblacion = data[i].Colonia_Poblacion;
            dir.municipio = data[i].Municipio;
            dir.estado = data[i].edo;
            dir.index = i+1;
            this.direcciones_entrega.push(dir);
          }
         
        }
      },
      error: (err) => {
        Swal.fire({
          title: 'Error!',
          text: err.message,
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      },
    });
  }

  Buscar_Dir_Facturacion(){
    this.direcciones_facturacion = [];
    this.service.Obtener_Direcciones(this.ncliente.codigo_postal_facturacion).subscribe({
      next: (res: any) => {
        if(res.code == 0){
          let data = res.data;
          for(let i = 0; i < data.length; i++){
            let dir = new C_Direccion();
            dir.cve_estado = data[i].Cve_Estado;
            dir.codigo_postal = data[i].c_CodigoPostal;
            dir.colonia_poblacion = data[i].Colonia_Poblacion;
            dir.municipio = data[i].Municipio;
            dir.estado = data[i].edo;
            dir.index = i+1;
            this.direcciones_facturacion.push(dir);
          }
         
        }
      },
      error: (err) => {
        Swal.fire({
          title: 'Error!',
          text: err.message,
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      },
    });
  }

  Establecer_Dir_Entrega($event:any){
    let index = $event.target.value;  
    let dir = this.direcciones_entrega.find(x => x.index == index);
    this.ncliente.set_direccion_entrega(dir!);
  }

  Establecer_Dir_Facturacion($event:any){
    let index = $event.target.value;
    let dir = this.direcciones_facturacion.find(x => x.index == index);
    this.ncliente.set_direccion_facturacion(dir!);
  }

  Buscar_Producto_1($event: any){
    this.productos_1 = [];
    let valor = $event.target.value;
    let products: C_Productos[] = [];


    if (valor.length > 3) {
      this.service.Buscar_Productos(valor, "", "").subscribe({
        next: (res: any) => {
          if (res.code == 0) {
            let data = res.data;
            for (let i = 0; i < data.length; i++) {
              let producto = new C_Productos();
              producto.cve_producto = data[i].Cve_Producto;
              producto.descripcion = data[i].Descripcion;
              producto.existencia = Number(data[i].existencia) >= 0 ? Number(data[i].existencia) : 0;
              producto.precio_minimo_venta_base = Number(data[i].precio_minimo_venta);
              producto.pantalla = data[i].Cve_Producto + " - " + data[i].Descripcion;
              producto.cobrar_envio = data[i].envio;
              producto.cantidad = 1;
              products.push(producto);
            }
            this.productos_1 = products;
          } else {
            this.productos_1 = products;
          }
        },
        error: (err) => {
          Swal.fire({
            title: 'Error!',
            text: err.message,
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
      });
    }
  }

  Buscar_Producto_2($event: any){
    this.productos_2 = [];
    let valor = $event.target.value;
    let products: C_Productos[] = [];


    if (valor.length > 3) {
      this.service.Buscar_Productos(valor, "", "").subscribe({
        next: (res: any) => {
          if (res.code == 0) {
            let data = res.data;
            for (let i = 0; i < data.length; i++) {
              let producto = new C_Productos();
              producto.cve_producto = data[i].Cve_Producto;
              producto.descripcion = data[i].Descripcion;
              producto.existencia = Number(data[i].existencia) >= 0 ? Number(data[i].existencia) : 0;
              producto.precio_minimo_venta_base = Number(data[i].precio_minimo_venta);
              producto.pantalla = data[i].Cve_Producto + " - " + data[i].Descripcion;
              producto.cobrar_envio = data[i].envio;
              producto.cantidad = 1;
              products.push(producto);
            }
            this.productos_2 = products;
          } else {
            this.productos_2 = products;
          }
        },
        error: (err) => {
          Swal.fire({
            title: 'Error!',
            text: err.message,
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
      });
    }
  }

  Producto_select_1($event: any){ 
    let producto = $event.option.value;
    this.ncliente.cve_producto_paciente_1 = producto.cve_producto;
    this.ncliente.producto_paciente_1 = producto.descripcion;
  }
  
  Producto_select_2($event: any){ 
    let producto = $event.option.value;
    this.ncliente.cve_producto_paciente_2 = producto.cve_producto;
    this.ncliente.producto_paciente_2 = producto.descripcion;
  }


  Guardar_Nuevo_Cliente(){
    console.log(this.ncliente);
    let enviar = true;
    if(this.ncliente.nombre == "" || 
      this.ncliente.nombre_contacto == "" ||
       this.ncliente.calle_numero_entrega == "" || 
       this.ncliente.codigo_postal_entrega == "" || 
      this.ncliente.cve_clase_cte == "" || this.ncliente.cve_medico == "" ||  this.ncliente.tipo_pago == "" ){
      Swal.fire({
        title: 'Error!',
        text: "Faltan datos obligatorios por llenar",
        icon: 'error',
        confirmButtonText: 'Ok'
      });
    
      enviar = false;
      return;
    }

    if(this.ncliente.facturacion == true){
      if(this.ncliente.razon_social_facturacion == "" || 
      this.ncliente.codigo_postal_facturacion == "" || 
      this.ncliente.calle_facturacion == "" || 
      this.ncliente.rfc_facturacion == "" || 
      this.ncliente.uso_cfdi_facturacion == "" ||
      this.ncliente.regimen_fiscal_facturacion == "" 
     ){
        Swal.fire({
          title: 'Error!',
          text: "Faltan datos de facturación por llenar",
          icon: 'error',
          confirmButtonText: 'Ok'
        });
        enviar = false;
        return;
      }
    }

    if(( this.ncliente.cve_producto_paciente_1 =="" || this.ncliente.docis_paciente_1 == 0 || this.ncliente.cartucho_paciente_1 ==0 || this.ncliente.compra_paciente_1 == 0 ) && 
      (this.ncliente.cve_producto_paciente_2 == "" || this.ncliente.docis_paciente_2 == 0 || this.ncliente.cartucho_paciente_2 == 0 || this.ncliente.compra_paciente_2 == 0 )){
      Swal.fire({
        title: 'Error!',
        text: "Debe agregar al menos una receta para el paciente",
        icon: 'error',
        confirmButtonText: 'Ok'
      });
      enviar = false;
      return;
    }

    if(enviar == true){
      this.btn_guardando = true;
      this.service.Guardar_Cliente(this.ncliente, this.user.cve_usuario).subscribe({
        next: (res: any) => {
          if(res.code == 0){
            Swal.fire({
              title: 'Exito!',
              text: "Cliente guardado correctamente",
              icon: 'success',
              confirmButtonText: 'Ok'
            }).then((result) => {
                         
              this.Nuevo_Cliente();
              this.productos_1 = [];
              this.productos_2 = [];
              this.direcciones_entrega = [];
              this.direcciones_facturacion = [];
              this.list_usos_cfdi= [];
              this.tipos_pago = [];
              this.clases_cliente  = [];
              this.lista_medicos = [];
              this.vista = "nuevo";   
            });
            this.Nuevo_Cliente();
          }else{
            Swal.fire({
              title: 'Error!',
              text: res.message,
              icon: 'error',
              confirmButtonText: 'Ok'
            });
          }
        },
        error: (err) => {
          Swal.fire({
            title: 'Error!',
            text: err.message,
            icon: 'error',
            confirmButtonText: 'Ok'
          });
          this.btn_guardando = false;
        },complete: () => {
          this.btn_guardando = false;
        }

      });
    }







  }


  //=========================================  FUNCIONES MODIFICAR CLIENTE ==========================

  buscar_responsable($event: any) {
    let valor = $event.target.value;
    let respons: C_Responsable[] = [];
    if (valor.length > 3) {
      this.service.Buscar_Clientes(valor, this.user.cve_usuario).subscribe({
        next: (res: any) => {
          this.list_clientes = [];
          this.muestra_btn_modificar = false;
          if (res.code == 0) {
            let data = res.data;          
            for (let i = 0; i < data.length; i++) {
              let r = new C_Responsable();
              r.cve_cliente = data[i].cve_cliente;
              r.nombre = data[i].Nombre_Cte;
              r.telefono = data[i].Telefono;
              r.telefono_2 = data[i].Telefono_2;
              r.email = data[i].EMail;
              r.tipo_pago = data[i].FormPago_Factura;
              r.cve_clase_cte = data[i].Cve_Clase_Cte;
              r.cve_medico = data[i].Cve_Ruta;
              r.facturacion = (data[i].RFC != "" && data[i].RFC != null && data[i].RFC != undefined) == true ? true : false;  
              r.persona_fisica =true;
              r.persona_moral = false;
              r.razon_social_facturacion = data[i].Razon_Social;
              r.calle_facturacion = data[i].Calle_No;
              r.numero_exterior_facturacion =data[i].Numero_Exterior;
              r.numero_interior_facturacion =data[i].Numero_Interior;
              r.codigo_postal_facturacion =data[i].CP;
              r.poblacion_facturacion =data[i].Poblacion ;
              r.delegacion_facturacion =data[i].Del_Municipio ;
              r.colonia_facturacion =data[i].Colonia;
              r.rfc_facturacion =data[i].RFC;
              r.regimen_fiscal_facturacion =data[i].c_RegimenFiscal;
              r.uso_cfdi_facturacion =data[i].c_usoCFDI;
              r.nombre_contacto  = data[i].Nombre_Propietario;
              r.delegacion_entrega =data[i].Del_Municipio_E;
              r.calle_numero_entrega =data[i].CalleNumero_E;
              r.codigo_postal_entrega =data[i].CP_E;
              r.colonia_entrega =data[i].Colonia_E;
              r.poblacion_entrega =data[i].Poblacion_E;
              r.fecha_recompra =  data[i].FechaRecompra;

              r.nombre_paciente_1 = data[i].NombrePaciente;
              r.edad_anyos_paciente_1 = data[i].EdadAñosP;
              r.edad_meses_paciente_1 = data[i].EdadMesesP;
              r.fecha_nacimiento_paciente_1 = data[i].FechaNacimientoP;
              r.cve_producto_paciente_1 = data[i].ProductoP;
              r.producto_paciente_1 = data[i].name_p1;
              r.docis_paciente_1 = data[i].DosisP;
              r.cartucho_paciente_1 = data[i].CartuchoP;
              r.cubre_1 = data[i].CubreP;
              r.compra_paciente_1 = data[i].CompraP;
              r.cubre_total_paciente_1 = data[i].CubreTotalP;
              r.set_cubre_1();
              r.set_cubre_total_1();

              r.nombre_paciente_2 = data[i].NombrePaciente1;
              r.edad_anyos_paciente_2 = data[i].EdadAñosP1;
              r.edad_meses_paciente_2 = data[i].EdadMesesP1;
              r.fecha_nacimiento_paciente_2 = data[i].FechaNacimientoP1;
              r.cve_producto_paciente_2 = data[i].ProductoP1;
              r.producto_paciente_2 = data[i].name_p2;
              r.docis_paciente_2 = data[i].DosisP1;
              r.cartucho_paciente_2 = data[i].CartuchoP1;
              r.cubre_2 = data[i].CubreP1;
              r.compra_paciente_2 = data[i].CompraP1;
              r.cubre_total_paciente_2 = data[i].CubreTotalP1;
              r.set_cubre_2();
              r.set_cubre_total_2();
              r.folio_zaizen = data[i].zaizen;
             this.list_clientes.push(r);                                            
            }

           

          } else {
           
          }

        },
        error: (err) => {
          Swal.fire({
            title: 'Error!',
            text: err.message,
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
      });
    }
  }

  Ver_Cliente($event : any){
    let cliente = $event.option.value;
    this.mcliente = cliente;
    this.muestra_btn_modificar = true;
   
  }

  Cancelar_Modificacion(){
    this.mcliente = new C_Responsable();
    this.muestra_btn_modificar = false;
    this.modificar = false;
  }

  Guardar_Modificacion(){
    let enviar = true;
    if(this.mcliente.nombre == "" || 
      this.mcliente.nombre_contacto == "" ||
       this.mcliente.calle_numero_entrega == "" || 
       this.mcliente.codigo_postal_entrega == "" || 
      this.mcliente.cve_clase_cte == "" || this.mcliente.cve_medico == "" ||  this.mcliente.tipo_pago == "" ){
      Swal.fire({
        title: 'Error!',
        text: "Faltan datos obligatorios por llenar",
        icon: 'error',
        confirmButtonText: 'Ok'
      });
    
      enviar = false;
      return;
    }

    if(this.mcliente.facturacion == true){
      if(this.mcliente.razon_social_facturacion == "" || 
      this.mcliente.codigo_postal_facturacion == "" || 
      this.mcliente.calle_facturacion == "" || 
      this.mcliente.rfc_facturacion == "" || 
      this.mcliente.uso_cfdi_facturacion == "" ||
      this.mcliente.regimen_fiscal_facturacion == ""
      ){
          Swal.fire({
            title: 'Error!',
            text: "Faltan datos de facturación por llenar",
            icon: 'error',
            confirmButtonText: 'Ok'
          });
          enviar = false;
          return;
        }
      }
    

    if(( this.mcliente.cve_producto_paciente_1 =="" || this.mcliente.docis_paciente_1 == 0 || this.mcliente.cartucho_paciente_1 ==0 || this.mcliente.compra_paciente_1 == 0 ) && 
      (this.mcliente.cve_producto_paciente_2 == "" || this.mcliente.docis_paciente_2 == 0 || this.mcliente.cartucho_paciente_2 == 0 || this.mcliente.compra_paciente_2 == 0 ))
      {
      Swal.fire({
        title: 'Error!',
        text: "Debe agregar al menos una receta para el paciente",
        icon: 'error',
        confirmButtonText: 'Ok'
      });
      enviar = false;
      return;;
    }

    if(enviar == true){
      this.btn_guardando = true;
      this.service.Modificar_Cliente(this.mcliente, this.user.cve_usuario).subscribe({
        next: (res: any) => {
          if(res.code == 0){
            Swal.fire({
              title: 'Exito!',
              text: "Cliente modificado correctamente",
              icon: 'success',
              confirmButtonText: 'Ok'
            }).then((result) => {
                         
              this.Cancelar_Modificacion();
              this.productos_1 = [];
              this.productos_2 = [];
              this.direcciones_entrega = [];
              this.direcciones_facturacion = [];
              this.list_usos_cfdi= [];
              this.tipos_pago = [];
              this.clases_cliente  = [];
              this.lista_medicos = [];
              this.vista = "nuevo";   
            });
            this.Cancelar_Modificacion();
          }else{
            Swal.fire({
              title: 'Error!',
              text: res.message,
              icon: 'error',
              confirmButtonText: 'Ok'
            });
          }
        },
        error: (err) => {
          Swal.fire({
            title: 'Error!',
            text: err.message,
            icon: 'error',
            confirmButtonText: 'Ok'
          });
          this.btn_guardando = false;
        },complete: () => {
          this.btn_guardando = false;
        }

      });
    }


  }





}
 