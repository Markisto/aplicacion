import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild  } from '@angular/core';
import { C_Usuario } from '../../classes/clase_usuario';
import { Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { PedidosService } from './pedidos.service';
import Swal from 'sweetalert2';
import { C_Responsable } from '../../classes/clase_responsable';
import { Observable } from 'rxjs';
import bootstrap from '../../../main.server';
import { C_Productos } from '../../classes/clase_productos';


@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CommonModule, NgSelectModule, FormsModule],
  templateUrl: './pedidos.component.html',
  styleUrl: './pedidos.component.css'
})
export class PedidosComponent implements OnInit{

  user = new C_Usuario("","","","");
  @ViewChild('responsableSelect') respo! : ElementRef ;
  @ViewChild('modal') modal! : ElementRef ;

  constructor(private router : Router, private service : PedidosService) { }
  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem('user') || '{}');
    console.log(this.user);
    if(this.user.cve_usuario == ""){
      //this.router.navigate(['/login']);
    }
    this.obtener_sucursales();
    this.obtener_tipo_pago();
    this.obtener_tipo_cliente();
  }

  responsables : C_Responsable[] = [];
  responsable_select: C_Responsable | any;
  vista = 'consulta';
  sucursales : any[] = [];
  tipo_pago : any[] = [];
  tipo_cliente : any[] = [];  
  productos : C_Productos[] = []
  sucursal_select = this.user.cve_sucursal;
  producto_select : C_Productos = new C_Productos();
  productos_pedir : C_Productos[] = [];
  num_productos = 0;
  costo_total = 0;
  obtener_sucursales(){
    this.service.Obtener_Sucursales().subscribe({
      next: (res: any) => {
        console.log(res);
        if(res.code == 0){
          this.sucursales = res.data;          
        }
        this.sucursal_select = this.user.cve_sucursal;
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

  cambio_responsable($event : any){
    console.log("cambio de responsable");
    console.log($event);
    let valor = $event;
    this.responsable_select = valor;    
  }

  buscar_responsable($event : any){
    let valor = $event.target.value;
    let respons : C_Responsable[] = [];
    if(valor.length > 3){
      this.service.Obtener_Clientes(valor,this.user.cve_usuario).subscribe({
        next: (res: any) => {
          if(res.code == 0){
            let data = res.data;
           
            for(let i = 0; i < data.length; i++){
              let responsable = new C_Responsable();
              responsable.cve_responsable = data[i].Cve_Cliente;
              responsable.nombre = data[i].Nombre_Cte;
              responsable.razon_social = data[i].Razon_Social;
              responsable.calle_no = data[i].Calle_No;
              responsable.colonia = data[i].Colonia;
              responsable.del_municipio = data[i].Del_Municipio;
              responsable.cp = data[i].CP;
              responsable.cve_poblacion = data[i].Cve_Poblacion;
              responsable.telefono = data[i].Telefono;
              responsable.telefono_2 = data[i].Telefono_2;
              responsable.cve_clase_cte = data[i].Cve_Clase_Cte;
              responsable.cve_tipo_cte = data[i].Cve_Tipo_Cte;
              responsable.c_uso_cfdi = data[i].C_UsoCFDI;
              responsable.c_regimen_fiscal = data[i].C_RegimenFiscal;
              respons.push(responsable);
            }

            this.responsables = [...respons];
                                              
          }else{
            this.responsables = [...respons];
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




  Buscar_Producto($event:any){
    let valor = $event.target.value;
    let products : C_Productos[] = [];

   
    if(valor.length > 3){
      this.service.Buscar_Productos(valor,this.sucursal_select,this.responsable_select.cve_clase_cte).subscribe({
        next: (res: any) => {
          if(res.code == 0){
            let data = res.data;
            for(let i = 0; i < data.length; i++){
              let producto = new C_Productos();
              producto.cve_producto = data[i].Cve_Producto;
              producto.descripcion = data[i].Descripcion;                   
              producto.existencia = data[i].Existencia;
              producto.precio_minimo_venta_base = data[i].precio_minimo_venta;
              producto.pantalla = data[i].Descripcion + "* Disponible" + data[i].Existencia ;
           
              
              products.push(producto);
            }

            this.productos = [...products];
                                              
          }else{
            this.productos = [...products];
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

  Producto_select($event:any){
    let valor = $event;
    this.producto_select = valor;
    
  }

  obtener_tipo_pago(){
    this.service.Obtener_Tipo_Pago().subscribe({
      next: (res: any) => {
        if(res.code == 0){
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

  obtener_tipo_cliente(){
    this.service.Obtener_Tipo_Cliente().subscribe({
      next: (res: any) => {
        if(res.code == 0){
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

  Abrir_Modal(){
    
    if(this.sucursal_select == ""){
      Swal.fire({
        title: 'Error!',
        text: "Debes seleccionar una sucursal",
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      return;
    }

    if(this.responsable_select == undefined){
      Swal.fire({
        title: 'Error!',
        text: "Debes seleccionar un cliente",
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      return;
    } 


  
    this.modal.nativeElement.style.display = "block";
  }
  Cerra_Modal(){
    this.producto_select = new C_Productos();
    this.productos = [];
    this.productos = [...this.productos];
    this.modal.nativeElement.style.display = "none";
  }

  Agregar_Producto(){
    if(this.producto_select.cantidad == 0){
      Swal.fire({
        title: 'Error!',
        text: "Debes seleccionar una cantidad",
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      return;
    }
    this.productos_pedir.push(this.producto_select);    
    this.num_productos = this.productos_pedir.length;
    for(let i = 0; i < this.productos_pedir.length; i++){
      this.costo_total += Number(this.productos_pedir[i].precio_minimo_venta_base) * Number(this.productos_pedir[i].cantidad);
    }
    this.Cerra_Modal();
  }


}
