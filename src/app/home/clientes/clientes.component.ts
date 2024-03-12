import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';


import { C_Pacientes } from '../../classes/clase_pacientes';
import { C_Responsable } from '../../classes/clase_responsable';
import { FormsModule } from '@angular/forms';
import { C_Direccion } from '../../classes/clase_direccion';
import { ClientesService } from './clientes.service';
import Swal from 'sweetalert2';
import { C_Usuario } from '../../classes/clase_usuario';


@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css'
})
export class ClientesComponent implements OnInit {
 

  user : C_Usuario = new C_Usuario("","","","","");
  vista = "nuevo";
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

  Nuevo_Cliente(){
    this.vista = "nuevo";
    this.ncliente.cve_cliente = 1;
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






}
 