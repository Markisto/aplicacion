import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
import { C_Usuario } from '../../classes/clase_usuario';
import { Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { PedidosService } from './pedidos.service';
import Swal from 'sweetalert2';
import { C_Responsable } from '../../classes/clase_responsable';
import { Observable, OperatorFunction, Subject, catchError, debounceTime, distinctUntilChanged, filter, map, merge, switchMap, tap } from 'rxjs';
import bootstrap from '../../../main.server';
import { C_Productos } from '../../classes/clase_productos';
import { C_Pedido } from '../../classes/clase_pedido';
import { data } from 'jquery';
import { Console } from 'console';
import { DomSanitizer } from '@angular/platform-browser';
import { Conexion } from '../../classes/clase_conexion';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { ModalDismissReasons, NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CommonModule, NgSelectModule, FormsModule, MatAutocompleteModule, MatInputModule],
  templateUrl: './pedidos.component.html',
  styleUrl: './pedidos.component.css'
})
export class PedidosComponent implements OnInit {

  user = new C_Usuario("", "", "", "", "");

  private modalService = inject(NgbModal);
  closeResult = '';

  @ViewChild('modal') modal!: ElementRef;
  @ViewChild('modal_cargando') modal_cargando!: ElementRef;
  @ViewChild('checkfactura') checkfactura!: ElementRef;
  @ViewChild('p1') p1!: ElementRef;
  @ViewChild('p2') p2!: ElementRef;

  constructor(private router: Router, private service: PedidosService, private _sanitizer: DomSanitizer) { }
  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem('user') || '{}');
    console.log(this.user);
    if (this.user.cve_usuario == "") {
      //this.router.navigate(['/login']);
    }

    console.log(this.date_ac.toLocaleDateString().replace(/\//g, "-").split("-").reverse().join("-"));
    this.obtener_sucursales();
    this.obtener_tipo_pago();
    //this.obtener_tipo_cliente();
    this.obtener_tipo_envio();
  }

  responsables: C_Responsable[] = [];
  responsable_select: C_Responsable = new C_Responsable();
  vista = 'consulta';
  sucursales: any[] = [];
  tipo_pago: any[] = [];
  tipo_cliente: any[] = [];
  productos: C_Productos[] = []

  producto_select: C_Productos = new C_Productos();
  productos_pedir: C_Productos[] = [];
  num_productos = 0;
  costo_total = 0;
  tipo_envio: any[] = [];
  nuevo_pedido = new C_Pedido(0);
  mostrar_envio = false;
  //--------------------------------- PANEL DE BUSQUEDA DE PEDIDOS --------------------------------
  pedidos_consulta: C_Pedido[] = [];
  pedido_consulta_select: C_Pedido = new C_Pedido(0);
  date_ac = new Date();
  buscar_desde = this.formatDate(this.date_ac);
  buscar_hasta = this.formatDate(this.date_ac);;
  buscar_status = "0";
  selected_id = "";
  archivo: File | any;
  con = new Conexion();
  boton_buscar = false;
  loading = false;
  consignatarios: any[] = [];

  formatDate(date: Date) {
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) {
      month = '0' + month;
    }

    if (day.length < 2) {
      day = '0' + day;
    }

    return [year, month, day].join('-');

  }

  Nuevo_Pedido() {
    this.nuevo_pedido.cve_folio = 1;
    this.nuevo_pedido.cve_vendedor = this.user.cve_usuario;
    this.nuevo_pedido.cve_usuario = this.user.nombre_sesion;
    this.nuevo_pedido.cve_sucursal = this.user.cve_sucursal;
    this.vista = 'nuevo'
  }

  obtener_sucursales() {
    this.service.Obtener_Sucursales().subscribe({
      next: (res: any) => {
        console.log(res);
        if (res.code == 0) {
          this.sucursales = res.data;
        }
        this.nuevo_pedido.cve_sucursal = this.user.cve_sucursal;
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

  cambio_responsable($event: any) {
    console.log("cambio de responsable");
    console.log($event.option.value);
    let valor = $event.option.value;
    console.log("valor respon");
    console.log(valor);
    this.responsable_select = valor;

    this.nuevo_pedido.cve_compañia = this.responsable_select.cve_compania;
    this.nuevo_pedido.cve_cliente = this.responsable_select.cve_responsable;
    this.nuevo_pedido.rfc = this.responsable_select.rfc;
    this.nuevo_pedido.razon_social = this.responsable_select.razon_social;



    if (this.nuevo_pedido.rfc == undefined || this.nuevo_pedido.rfc == "") {
      this.nuevo_pedido.factura = false;
      this.checkfactura.nativeElement.checked = false;
    } else {
      this.nuevo_pedido.factura = true;
      this.checkfactura.nativeElement.checked = true;
    }

    if (this.responsable_select.nombre_paciente_1 == "" && this.responsable_select.nombre_paciente_2 == "") {
      this.nuevo_pedido.paciente_select = "";
      this.nuevo_pedido.cubre_select = "";
    }

    if (this.responsable_select.nombre_paciente_1 != "" && this.responsable_select.nombre_paciente_2 == "") {
      this.p1.nativeElement.checked = true;
      this.nuevo_pedido.paciente_select = this.responsable_select.nombre_paciente_1;
      this.nuevo_pedido.cubre_select = this.responsable_select.cubre_1;
    }

    if (this.responsable_select.nombre_paciente_1 == "" && this.responsable_select.nombre_paciente_2 != "") {
      this.p2.nativeElement.checked = true;
      this.nuevo_pedido.paciente_select = this.responsable_select.nombre_paciente_2;
      this.nuevo_pedido.cubre_select = this.responsable_select.cubre_2;
    }

    this.buscar_consignatario(this.nuevo_pedido.cve_cliente);

  }

  buscar_consignatario(cve_cliente : string) {
    this.consignatarios = [];
    this.service.Obtener_Consignatarios(cve_cliente).subscribe({
      next: (res: any) => {
        if (res.code == 0) {
          this.consignatarios = res.data;
        } else {
          Swal.fire({
            title: 'Error!',
            text: "No se encontraron direcciones de envio para este cliente por favor registre una nueva direccion de envio en el modulo de clientes",
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
          this.consignatarios = [];
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

  establece_paciente(paciente: string) {
    console.log("establece paciente");
    console.log(paciente);


    if (paciente == "p1") {
      this.nuevo_pedido.paciente_select = this.responsable_select.nombre_paciente_1;
      this.nuevo_pedido.cubre_select = this.responsable_select.cubre_1;
    } else if (paciente == "p2") {
      this.nuevo_pedido.paciente_select = this.responsable_select.nombre_paciente_2;
      this.nuevo_pedido.cubre_select = this.responsable_select.cubre_2;
    }


  }

  buscar_responsable($event: any) {
    let valor = $event.target.value;
    let respons: C_Responsable[] = [];
    if (valor.length > 3) {
      this.service.Obtener_Clientes(valor, this.user.cve_usuario).subscribe({
        next: (res: any) => {
          if (res.code == 0) {
            let data = res.data;

            for (let i = 0; i < data.length; i++) {
              let responsable = new C_Responsable();
              responsable.cve_responsable = data[i].Cve_Cliente;
              responsable.nombre = data[i].Nombre_Cte;
              responsable.razon_social = data[i].Razon_Social;
              responsable.rfc = data[i].RFC;
              responsable.calle_no = data[i].Calle_No;
              responsable.colonia = data[i].Colonia;
              responsable.del_municipio = data[i].Del_Municipio;
              responsable.cp = data[i].CP;
              responsable.cve_poblacion = data[i].Cve_Poblacion;
              responsable.telefono = data[i].Telefono;
              responsable.telefono_2 = data[i].Telefono_2;
              responsable.cve_clase_cte = data[i].Cve_Clase_Cte;
              responsable.cve_tipo_cte = data[i].Cve_Tipo_Cte;
              responsable.c_uso_cfdi = data[i].c_UsoCFDI;
              responsable.c_regimen_fiscal = data[i].c_RegimenFiscal;
              responsable.nombre_paciente_1 = data[i].Nombre_Paciente_1;
              responsable.cubre_1 = data[i].Cubre_1;
              responsable.nombre_paciente_2 = data[i].Nombre_Paciente_2;
              responsable.cubre_2 = data[i].Cubre_2;
              respons.push(responsable);
            }

            this.responsables = respons;

          } else {
            this.responsables = respons;;
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




  Buscar_Producto($event: any) {
    this.productos = [];
    let valor = $event.target.value;
    let products: C_Productos[] = [];


    if (valor.length > 3) {
      this.service.Buscar_Productos(valor, this.nuevo_pedido.cve_sucursal, this.responsable_select.cve_clase_cte).subscribe({
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
            this.productos = products;
          } else {
            this.productos = products;
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

  Producto_select($event: any) {
    let valor = $event.option.value;
    this.producto_select = valor;

  }

  obtener_tipo_pago() {
    this.service.Obtener_Tipo_Pago().subscribe({
      next: (res: any) => {
        if (res.code == 0) {
          this.tipo_pago = res.data;
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

  obtener_tipo_cliente() {
    this.service.Obtener_Tipo_Cliente().subscribe({
      next: (res: any) => {
        if (res.code == 0) {
          this.tipo_cliente = res.data;
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

  obtener_tipo_envio() {
    this.service.Obtener_Tipo_Envtio().subscribe({
      next: (res: any) => {
        if (res.code == 0) {
          this.tipo_envio = res.data;
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

  Abrir_Modal(content: TemplateRef<any>) {

    if (this.nuevo_pedido.cve_sucursal == "") {
      Swal.fire({
        title: 'Error!',
        text: "Debes seleccionar una sucursal",
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      return;
    }

    if (this.responsable_select == undefined) {
      Swal.fire({
        title: 'Error!',
        text: "Debes seleccionar un cliente",
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      return;
    }

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;

    });

    // this.modal.nativeElement.style.display = "block";
  }

  private getDismissReason(reason: any): string {
    switch (reason) {
      case ModalDismissReasons.ESC:
        return 'by pressing ESC';
      case ModalDismissReasons.BACKDROP_CLICK:
        return 'by clicking on a backdrop';
      default:
        return `with: ${reason}`;
    }
  }

  Cerra_Modal() {
    this.modalService.dismissAll();
    this.producto_select = new C_Productos();
    this.productos = [];


  }

  Agregar_Producto() {
    if (this.producto_select.cantidad == 0) {
      Swal.fire({
        title: 'Error!',
        text: "Debes seleccionar una cantidad",
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      return;
    }

    let existe = this.productos_pedir.filter((producto) => producto.cve_producto == this.producto_select.cve_producto);

    if (existe.length > 0) {
      let index = this.productos_pedir.indexOf(existe[0]);
      let cantidad = Number(existe[0].cantidad) + this.productos_pedir[index].cantidad;
      if (cantidad > this.productos_pedir[index].existencia) {
        Swal.fire({
          title: 'Error!',
          text: "La cantidad seleccionada es mayor a la existencia",
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
        return;
      } else {
        this.productos_pedir[index].cantidad = cantidad;
      }
    } else {
      if (this.producto_select.cantidad > this.producto_select.existencia) {
        Swal.fire({
          title: 'Error!',
          text: "La cantidad seleccionada es mayor a la existencia",
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
        return;
      }
      this.productos_pedir.push(this.producto_select);
      this.num_productos = this.productos_pedir.length;
    }

    this.validar_envio();
    this.Obtener_Total_Costo();
    this.Cerra_Modal();
  }

  Quitar_Producto(producto: C_Productos) {
    let index = this.productos_pedir.indexOf(producto);
    this.productos_pedir.splice(index, 1);
    this.num_productos = this.productos_pedir.length;
    this.validar_envio();
    this.Obtener_Total_Costo();
  }

  validar_envio() {
    let productos_envio = this.productos_pedir.filter((producto) => producto.cobrar_envio == "si" && producto.cantidad == 1 && this.productos_pedir.length == 1);
    if (productos_envio.length > 0 && Number(this.nuevo_pedido.cubre_select) < 25) {
      this.mostrar_envio = true;
      this.nuevo_pedido.costo_envio = 250;
      this.costo_total += 250;

    } else {
      this.mostrar_envio = false;
      this.nuevo_pedido.costo_envio = -1;
    }
  }


  Obtener_Total_Costo() {
    this.costo_total = 0;
    for (let i = 0; i < this.productos_pedir.length; i++) {
      this.costo_total += Number(this.productos_pedir[i].precio_minimo_venta_base) * Number(this.productos_pedir[i].cantidad);
    }

    if (this.mostrar_envio == true) {
      this.costo_total += this.nuevo_pedido.costo_envio;
    }

  }

  Guardar_Pedido() {
    let send = true;

    if (this.productos_pedir.length == 0) {
      Swal.fire({
        title: 'Error!',
        text: "Debes agregar al menos un producto",
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      send = false;
      return;
    }

    if (this.nuevo_pedido.cve_cliente == "") {
      Swal.fire({
        title: 'Error!',
        text: "Debes seleccionar un cliente",
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      send = false;
      return;
    }



    if (this.nuevo_pedido.cve_sucursal == "") {
      Swal.fire({
        title: 'Error!',
        text: "Debes seleccionar una sucursal",
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      send = false;
      return;
    }

    if (this.nuevo_pedido.tipo_pago == "") {
      Swal.fire({
        title: 'Error!',
        text: "Debes seleccionar un tipo de pago",
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      send = false;
      return;
    }

    if (this.nuevo_pedido.nuevo_recompra == "") {
      Swal.fire({
        title: 'Error!',
        text: "Seleccione si es un nuevo cliente o recompra",
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      send = false;
      return;
    }

    if (this.nuevo_pedido.fecha_envio == "") {
      Swal.fire({
        title: 'Error!',
        text: "Debes seleccionar la fecha de envio",
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      send = false;
      return;
    }

    if (this.mostrar_envio == true && this.nuevo_pedido.costo_envio == -1) {
      Swal.fire({
        title: 'Error!',
        text: "Debe establecer el costo de envio",
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      send = false;
      return;
    }

    if (this.nuevo_pedido.cve_vendedor == "") {
      Swal.fire({
        title: 'Error!',
        text: "Error con el usuario",
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      send = false;
      return;
    }

    if(this.nuevo_pedido.cve_consignatario == ""){
      Swal.fire({
        title: 'Error!',
        text: "Debes seleccionar una direccion de envío",
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      send = false;
      return;
    }

    this.nuevo_pedido.productos_pedir = this.productos_pedir;
    this.nuevo_pedido.status = "CT";

    if (send) {


    this.loading = true;

    // console.log("nuevo pedido");
    // console.log(this.nuevo_pedido);


    this.service.Guardar_Pedido(this.nuevo_pedido).subscribe({
      next: (res: any) => {
        if (res.code == 0) {
          Swal.fire({
            title: 'Exito!',
            text: res.message,
            icon: 'success',
            confirmButtonText: 'Aceptar'
          }).then((result) => {

            let data = res.data[0];

            let pedido = new C_Pedido(data.Cve_Folio);
            pedido.fecha_documento = data.Capturado;
            pedido.rfc = data.RFC;
            pedido.cve_sucursal = data.Cve_Sucursal;
            pedido.nombre_sucursal = data.Nombre_Sucursal;
            pedido.razon_social = data.Razon_Social;
            pedido.status = data.Estatus;
            pedido.fecha_envio = data.Fecha_Envio;
            pedido.tipo_envio = data.Cve_Tipo_Envio;
            pedido.nombre_tipo_envio = data.Nombre_Tipo_Envio;



            this.Ver_Selected(pedido.cve_folio, Number(pedido.cve_sucursal), pedido);
            this.responsable_select = new C_Responsable();
            this.producto_select = new C_Productos();
            this.responsables = [];
            this.productos = [];
            this.nuevo_pedido = new C_Pedido(0);
            this.productos_pedir = [];
            this.num_productos = 0;
            this.costo_total = 0;
            this.mostrar_envio = false;
            this.vista = 'consulta';
          });


        } else {

          Swal.fire({
            title: 'Error!',
            text: res.message,
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
      },
      error: (err) => {
        Swal.fire({
          title: 'Error!',
          text: err.message,
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
        this.loading = false;
      }, complete: () => {
        this.loading = false;
      }
    });
    }
  }


  //================================= PANEL DE BUSQUEDA DE PEDIDOS =================================

  Buscar_Pedido() {
    if (this.buscar_desde != "") {
      if (this.buscar_hasta == "") {
        Swal.fire({
          title: 'Error!',
          text: "Debes seleccionar la fecha final",
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
        return;
      }
    }

    if (this.buscar_hasta != "") {
      if (this.buscar_desde == "") {
        Swal.fire({
          title: 'Error!',
          text: "Debes seleccionar la fecha inicial",
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
        return;
      }
    }

    if (this.buscar_desde == "" && this.buscar_hasta == "" && this.buscar_status == "0") {
      Swal.fire({
        title: 'Error!',
        text: "Debes seleccionar al menos un filtro",
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      return;
    }

    let fi = Date.parse(this.buscar_desde);
    let ff = Date.parse(this.buscar_hasta);

    if (fi > ff) {
      Swal.fire({
        title: 'Error!',
        text: "La fecha inicial no puede ser mayor a la fecha final",
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      return;
    }

    this.pedidos_consulta = [];
    this.pedido_consulta_select = new C_Pedido(0);

    this.boton_buscar = true;
    this.service.Buscar_Pedidos(this.buscar_desde, this.buscar_hasta, this.buscar_status, this.user.cve_usuario).subscribe({
      next: (res: any) => {
        if (res.code == 0) {
          let data = res.data;
          for (let i = 0; i < data.length; i++) {
            let pedido = new C_Pedido(data[i].Cve_Folio);
            pedido.fecha_documento = data[i].Capturado;
            pedido.rfc = data[i].RFC;
            pedido.cve_sucursal = data[i].Cve_Sucursal;
            pedido.nombre_sucursal = data[i].Nombre_Sucursal;
            pedido.razon_social = data[i].Razon_Social;
            pedido.status = data[i].Estatus;
            pedido.fecha_envio = data[i].Fecha_Envio;
            pedido.tipo_envio = data[i].Cve_Tipo_Envio;
            pedido.nombre_tipo_envio = data[i].Nombre_Tipo_Envio;
            pedido.nombre_consignatario = data[i].Consignatario;
            pedido.guia = data[i].detalle;
            this.pedidos_consulta.push(pedido);
          }

          console.log("pedido_consulta");
          console.log(this.pedidos_consulta);

        } else {
          this.pedidos_consulta = [];
        }
      },
      error: (err) => {
        this.boton_buscar = false;
        Swal.fire({
          title: 'Error!',
          text: err.message,
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }, complete: () => {
        this.boton_buscar = false;
      }
    });




  }



  Ver_Selected(folio = 0, sucursal = 0, pedido : any = null) {
    console.log("ver selected");
    console.log(this.selected_id);


    if ((folio == 0 && sucursal == 0) && this.selected_id != "" ) {
      let pedido = this.pedidos_consulta.filter((pedido) => pedido.cve_folio == Number(this.selected_id));
      this.pedido_consulta_select = pedido[0];
      this.pedido_consulta_select.productos_pedir = [];
      this.loading = true;
      this.service.Buscar_Pedido_Detalle(this.pedido_consulta_select.cve_folio, this.pedido_consulta_select.cve_sucursal).subscribe({
        next: (res: any) => {
          if (res.code == 0) {
            let data = res.data[0];
            let images = res.data[1];

            if (data != undefined) {
              for (let i = 0; i < data.length; i++) {
                let p = new C_Productos();
                p.cve_producto = data[i].Cve_Producto;
                p.descripcion = data[i].Descripcion;
                p.cantidad = data[i].Cantidad_Ordenada;
                p.precio = data[i].Precio_Publico;
                p.envio = data[i].Envio;
                p.sub_total = Number(data[i].Cantidad_Ordenada) * Number(data[i].Precio_Publico);
                this.pedido_consulta_select.productos_pedir.push(p);
              }
            }

            if (images != undefined) {
              for (let i = 0; i < images.length; i++) {
                if (i == 0) {
                  this.pedido_consulta_select.nombre_pago_1 = images[i].Nombre;
                  this.pedido_consulta_select.fecha_pago_1 = images[i].Fecha;
                  this.pedido_consulta_select.id_pago_1 = images[i].id;
                }

                if (i == 1) {
                  this.pedido_consulta_select.nombre_pago_2 = images[i].Nombre;
                  this.pedido_consulta_select.fecha_pago_2 = images[i].Fecha;
                  this.pedido_consulta_select.id_pago_2 = images[i].id;
                }
              }
            }
          }
        },
        error: (err) => {
          Swal.fire({
            title: 'Error!',
            text: err.message,
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
    }else if(folio != 0 && sucursal != 0){
      this.pedidos_consulta=[];
      this.pedidos_consulta.push(pedido);
      this.pedido_consulta_select = pedido;
      this.pedido_consulta_select.productos_pedir = [];
      this.selected_id = pedido.cve_folio.toString();
      this.loading = true;
      this.service.Buscar_Pedido_Detalle(folio, sucursal.toString()).subscribe({
        next: (res: any) => {
          if (res.code == 0) {
            let data = res.data[0];
            let images = res.data[1];
            console.log("data");
            console.log(res)

            if (data != undefined) {
              for (let i = 0; i < data.length; i++) {
                let p = new C_Productos();
                p.cve_producto = data[i].Cve_Producto;
                p.descripcion = data[i].Descripcion;
                p.cantidad = data[i].Cantidad_Ordenada;
                p.precio = data[i].Precio_Publico;
                p.envio = data[i].Envio;
                p.sub_total = Number(data[i].Cantidad_Ordenada) * Number(data[i].Precio_Publico);
                this.pedido_consulta_select.productos_pedir.push(p);
              }
            }

            if (images != undefined) {
              for (let i = 0; i < images.length; i++) {
                if (i == 0) {
                  this.pedido_consulta_select.nombre_pago_1 = images[i].Nombre;
                  this.pedido_consulta_select.fecha_pago_1 = images[i].Fecha;
                  this.pedido_consulta_select.id_pago_1 = images[i].id;
                }

                if (i == 1) {
                  this.pedido_consulta_select.nombre_pago_2 = images[i].Nombre;
                  this.pedido_consulta_select.fecha_pago_2 = images[i].Fecha;
                  this.pedido_consulta_select.id_pago_2 = images[i].id;
                }
              }
            }
          }
        },
        error: (err) => {
          Swal.fire({
            title: 'Error!',
            text: err.message,
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
          this.loading = false;
        }, complete: () => {
          this.loading = false;
        }
      });
    }
  }

  Cargar_Imagen(id: string) {
    console.log("cargar imagen");
    console.log(id);
    if (id != "") {
      this.loading = true;
      this.service.Cargar_Imagen(id, this.pedido_consulta_select.cve_folio.toString(), this.pedido_consulta_select.cve_sucursal).subscribe({
        next: (res: any) => {
          Swal.fire({
            title: 'Imagen',
            html: `<img src="${this.con.get_url() + res.data}" style="width: 100%; height: 100%;">`,
            confirmButtonText: 'Sustituir Pago',
            showCancelButton: true,
            cancelButtonText: 'Cerrar',
          }).then((result) => {
            if (result.isConfirmed == true) {
              this.Actualizar_Pago(id);
            }
          });
        },
        error: (err) => {
          Swal.fire({
            title: 'Error!',
            text: err.message,
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
    }

  }


  Subir_Pago() {
    Swal.fire({
      title: 'Subir Pago',
      input: 'file',
      inputAttributes: {
        'accept': 'image/*'
      },
      confirmButtonText: 'Subir',
      focusConfirm: false,
    }).then((result) => {
      console.log("result");
      console.log(result);

      if (result.isConfirmed == true) {

        let file = result.value;
        let nombre_archivo = file.name;
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.archivo = null;
          this.archivo = reader.result;

          this.Enviar_Pedido(nombre_archivo);
          console.log("Envio el archivo");
        }

      }


    });
  }



  Enviar_Pedido(nombre_archivo: string) {
    console.log("entro a enviar_pedido");

    if (this.pedido_consulta_select.cve_folio != 0) {
      this.loading = true;
      this.service.Subir_Pago(this.pedido_consulta_select.cve_folio.toString(), this.pedido_consulta_select.cve_sucursal, nombre_archivo, this.archivo).subscribe({
        next: (res: any) => {
          if (res.code == 0) {
            console.log(res);
            Swal.fire({
              title: 'Exito!',
              text: res.message,
              icon: 'success',
              confirmButtonText: 'Aceptar'
            }).then((result) => {
              this.Ver_Selected();
            });
          } else {
            Swal.fire({
              title: 'Error!',
              text: res.message,
              icon: 'error',
              confirmButtonText: 'Aceptar'
            });
          }
        },
        error: (err) => {
          Swal.fire({
            title: 'Error!',
            text: err.message,
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });

    }
  }

  Actualizar_Pago(id: string) {
    Swal.fire({
      title: 'Actualizar Pago',
      input: 'file',
      inputAttributes: {
        'accept': 'image/*'
      },
      confirmButtonText: 'Subir',
      focusConfirm: false,
    }).then((result) => {
      console.log("result");
      console.log(result);

      if (result.isConfirmed == true) {

        let file = result.value;
        let nombre_archivo = file.name;
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.archivo = null;
          this.archivo = reader.result;

          this.Actualizar_Pago_Envio(id, nombre_archivo);
          console.log("Envio el archivo");
        }

      }
    });
  }

  Actualizar_Pago_Envio(id: string, nombre_archivo: string) {
    if (this.pedido_consulta_select.cve_folio != 0) {
      this.loading = true;
      this.service.Actualizar_Pago(id, this.pedido_consulta_select.cve_folio.toString(), this.pedido_consulta_select.cve_sucursal, nombre_archivo, this.archivo).subscribe({
        next: (res: any) => {
          if (res.code == 0) {
            console.log(res);
            Swal.fire({
              title: 'Exito!',
              text: res.message,
              icon: 'success',
              confirmButtonText: 'Aceptar'
            }).then((result) => {
              this.Ver_Selected();
            });
          } else {
            Swal.fire({
              title: 'Error!',
              text: res.message,
              icon: 'error',
              confirmButtonText: 'Aceptar'
            });
          }
        },
        error: (err) => {
          Swal.fire({
            title: 'Error!',
            text: err.message,
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });

    }
  }



}
