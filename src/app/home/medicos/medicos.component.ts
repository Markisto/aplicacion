import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { C_Usuario } from '../../classes/clase_usuario';
import { C_Direccion } from '../../classes/clase_direccion';
import { C_Medico } from '../../classes/clase_medico';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MedicosService } from './medicos.service';

@Component({
  selector: 'app-medicos',
  standalone: true,
  imports: [CommonModule,FormsModule, MatAutocompleteModule, MatInputModule],
  templateUrl: './medicos.component.html',
  styleUrl: './medicos.component.css'
})
export class MedicosComponent implements OnInit {
  
  user : C_Usuario = new C_Usuario("","","","","");
  vista = "consulta";
  @ViewChild('buscar_medico_in') buscar_medico_in : ElementRef | any;
  direcciones_1 : C_Direccion[] = [];
  direcciones_2 : C_Direccion[] = [];
  btn_guardando = false;
  nmedico = new C_Medico();
  mmedico = new C_Medico();
  lista_medicos : C_Medico[] = [];
  modificar = false;
  muestra_btn_modificar = false;
  buscando_lista = false;
  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem("user") || "{}");
    console.log("user");
    console.log(this.user);
  }

  constructor(private service : MedicosService ) { }

  Nuevo_Medico(){
    this.vista = "nuevo";
    this.nmedico = new C_Medico();
    this.nmedico.Cve_Medico = "1";
  }

  Buscar_Direccion1(){
    this.direcciones_1 = [];
    this.service.Obtener_Direcciones(this.nmedico.CP).subscribe({
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
            this.direcciones_1.push(dir);
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

  Establecer_Dir_1($event : any){
    let index = $event.target.value;
    let dir = this.direcciones_1.find((x) => x.index == index);
    this.nmedico.set_direccion_1(dir!);
  }

  Buscar_Direccion2(){
    this.direcciones_2 = [];
    this.service.Obtener_Direcciones(this.nmedico.CP2).subscribe({
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
            this.direcciones_2.push(dir);
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

  Establecer_Dir_2($event : any){
    let index = $event.target.value;
    let dir = this.direcciones_2.find((x) => x.index == index);
    this.nmedico.set_direccion_2(dir!);
  }

  Guardar_Nuevo_Medico(){

    let enviar = true;

    if(this.nmedico.Nombre == ""){
      Swal.fire({
        title: 'Error!',
        text: "El nombre del médico es requerido",
        icon: 'error',
        confirmButtonText: 'Ok'
      });
      enviar = false;
      return;
    }

    if(this.nmedico.CP == "" || this.nmedico.CalleNumero == "" || this.nmedico.Colonia == "" || this.nmedico.Estado == "" || this.nmedico.Poblacion == ""){
      Swal.fire({
        title: 'Error!',
        text: "El Primer domicilio es requerido",
        icon: 'error',
        confirmButtonText: 'Ok'
      });
      enviar = false;
      return;
    }

    if(enviar){
      this.btn_guardando = true;
      this.service.Guardar_Medico(this.nmedico, this.user.cve_usuario).subscribe({
        next: (res: any) => {
          if(res.code == 0){
            Swal.fire({
              title: 'Guardado!',
              text: "El médico se ha guardado correctamente",
              icon: 'success',
              confirmButtonText: 'Ok'
            });
            this.vista = "consulta";
            this.direcciones_1 = [];
            this.direcciones_2 = [];
            this.nmedico = new C_Medico();
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
        }, complete: () => {
          this.btn_guardando = false;
        }
      });
    }





  }


  Buscar_Medico($event : any){
    let valor = $event.target.value;
    
    if(valor.length > 2){
      this.buscando_lista = true;
      this.service.Buscar_Medicos(valor,this.user.cve_usuario).subscribe({
        next: (res: any) => {
          this.lista_medicos = [];
          if(res.code == 0){
            
            let data = res.data;
            for(let i = 0; i < data.length; i++){
              let med = new C_Medico();
              med.Cve_Medico = data[i].Cve_Medico;
              med.Nombre = data[i].Nombre;
              med.Telefono1 = data[i].Telefono1;
              med.Telefono2 = data[i].Telefono2;
              med.email = data[i].email;
              med.CP = data[i].CP;
              med.CalleNumero = data[i].CalleNumero;
              med.Colonia = data[i].Colonia;
              med.Estado = data[i].Estado;
              med.Poblacion = data[i].Poblacion;
              med.CP2 = data[i].CP2;
              med.CalleNumero2 = data[i].CalleNumero2;
              med.Colonia2 = data[i].Colonia2;
              med.Estado2 = data[i].Estado2;
              med.Poblacion2 = data[i].Poblacion2;
              med.consultorio = data[i].consultorio;
              med.cedula = data[i].cedula;
              med.horario = data[i].horario;              
              this.lista_medicos.push(med);
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
          this.buscando_lista = false;
        }, complete: () => {
          this.buscando_lista = false;
        }
      });
    }
  }

  Ver_Medico($event : any){
    this.mmedico = new C_Medico();
    let medico = $event.option.value;
    this.mmedico = medico;
    this.muestra_btn_modificar = true;     
  }

  view_id(med : C_Medico){
    return med.Nombre;
  }


  Guardar_Modificacion(){
    let enviar = true;

    if(this.mmedico.Nombre == ""){
      Swal.fire({
        title: 'Error!',
        text: "El nombre del médico es requerido",
        icon: 'error',
        confirmButtonText: 'Ok'
      });
      enviar = false;
      return;
    }

    if(this.mmedico.CP == "" || this.mmedico.CalleNumero == "" || this.mmedico.Colonia == "" || this.mmedico.Estado == "" || this.mmedico.Poblacion == ""){
      Swal.fire({
        title: 'Error!',
        text: "El Primer domicilio es requerido",
        icon: 'error',
        confirmButtonText: 'Ok'
      });
      enviar = false;
      return;
    }

    if(enviar){
      this.btn_guardando = true;
      this.service.Editar_Medico(this.mmedico, this.user.cve_usuario).subscribe({
        next: (res: any) => {
          if(res.code == 0){
            Swal.fire({
              title: 'Guardado!',
              text: "El médico se ha guardado correctamente",              
              icon: 'success',
              confirmButtonText: 'Ok'
            }).then((result) => {
            this.vista = "consulta";
            this.modificar = false;
            this.direcciones_1 = [];
            this.direcciones_2 = [];
            this.mmedico = new C_Medico();
            this.muestra_btn_modificar = false;
            this.lista_medicos = [];
            this.view_id(this.mmedico);
            this.buscar_medico_in.nativeElement.value = "";
            });
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
        }, complete: () => {
          this.btn_guardando = false;
        }
      });
      
    }

  }

  Cancelar_Modificacion(){
    this.mmedico = new C_Medico();
    this.muestra_btn_modificar
    this.modificar = false;

  }


}
