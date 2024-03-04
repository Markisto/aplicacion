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
  responsable = "";
  vista = 'consulta';
  sucursales : any[] = [];
  tipo_pago : any[] = [];
  tipo_cliente : any[] = [];  
  obtener_sucursales(){
    this.service.Obtener_Sucursales().subscribe({
      next: (res: any) => {
        console.log(res);
        if(res.code == 0){
          this.sucursales = res.data;
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
              responsable.nombre = data[i].Nombre;
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


}
