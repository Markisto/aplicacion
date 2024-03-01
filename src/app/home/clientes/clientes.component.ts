import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import 'bootstrap-table';
import 'bootstrap-table/dist/extensions/mobile/bootstrap-table-mobile.min.js';
import Swal from 'sweetalert2';
import { C_Pacientes } from '../../classes/clase_pacientes';


@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css'
})
export class ClientesComponent implements OnInit {
 


  vista = "nuevo";
  pacientes : C_Pacientes[] = [];
  inittable = 1;
  
  constructor() {
    
   }

  ngOnInit(): void {
     
     this.Agregar_Paciente();
  }

  ngAfterViewChecked(){
    if(this.inittable < 2){
      this.inittable++;
      $('#table_new_paciente').bootstrapTable({
        classes: 'table table-sm table-bordered',
      });
      let pas = new C_Pacientes();
    pas.nombre_paciente = "Carmen";
    this.pacientes.push(pas);
    $('#table_new_paciente').bootstrapTable('append', this.pacientes);
    }
  }

  Agregar_Paciente(){
    let pas = new C_Pacientes();
    pas.nombre_paciente = "Carmen";
    this.pacientes.push(pas);
    $('#table_new_paciente').bootstrapTable('append', this.pacientes);
  }

}
 