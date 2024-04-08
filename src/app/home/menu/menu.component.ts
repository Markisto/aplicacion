import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { C_Usuario } from '../../classes/clase_usuario';
import { CommonModule } from '@angular/common';
import { PedidosService } from '../pedidos/pedidos.service';
import Swal from 'sweetalert2';
import { LoginService } from '../../login/login/login.service';
@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit {

  user = new C_Usuario("","","","","");

  p_dia = {
    pedidos: 0,
    total: 0
  }

  p_mes = {
    pedidos: 0,
    total: 0
  }
  
  constructor(private router: Router, private service : PedidosService, private sesionservice : LoginService) { }
  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem('user') || '{}');
    if(this.user.cve_usuario == ""){
      this.router.navigate(['login']);
    }

    this.Pedidos_Mes();
    this.Pedidos_Dia();
  }

  Pedidos_Mes(){
    this.service.Pedidos_Mes(this.user.cve_usuario).subscribe({
      next: (res: any) => {
        if(res.code==0){
          let data = res.data[0];
          this.p_mes.pedidos = data.Pedidos;
          this.p_mes.total = data.Monto;
        }
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo obtener la información de los pedidos del mes'
        });        
      }    
    });
  }

  Pedidos_Dia(){
    this.service.Pedidos_Dia(this.user.cve_usuario).subscribe({
      next: (res: any) => {
        if(res.code==0){
          let data = res.data[0];
          this.p_dia.pedidos = data.Pedidos;
          this.p_dia.total = data.Monto;
        }
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo obtener la información de los pedidos del día'
        });
        
      }
    
    
    });

  }

  Navegar(menu : string){
    console.log("ruta");
    console.log(menu);  
    this.router.navigate([`home/${menu}`]);
  }

  Salir(){
    this.sesionservice.CerrarSesion().subscribe({
      next: (res: any) => {
        if(res.code==0){
          sessionStorage.clear();
          this.router.navigate(['login']);
        }else{
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo cerrar la sesión'
          });
        }
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo cerrar la sesión'
        });
      }

    });
 
  }

  

}
