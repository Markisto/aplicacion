import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router} from '@angular/router';
import Swal from 'sweetalert2';
import { LoginService } from './login.service';
import { C_Usuario } from '../../classes/clase_usuario';
import { HttpClientModule } from '@angular/common/http';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  cve_usuario = '';
  password = '';
  constructor(private router: Router, private service : LoginService) { }

  login() {
  
    if(this.cve_usuario == "" || this.password == ""){
      Swal.fire({
        title: 'Error!',
        text: 'Usuario o contraseña vacios',
        icon: 'error',
        confirmButtonText: 'Ok'
      })
      return;
    }
    
    this.service.InicioSesion(this.cve_usuario, this.password).subscribe({
      next: (res : any) => {
        if(res.code == 0){
          let data = res.data;
          let user = new C_Usuario(data.token, data.Cve_Vendedor, data.Nombre, data.Cve_Sucursal,data.Usuario);
          sessionStorage.setItem('user', JSON.stringify(user));
          this.router.navigate(['home']);
        }else{
          Swal.fire({
            title: 'Error!',
            text: res.message,
            icon: 'error',
            confirmButtonText: 'Ok'
          })
        }
      },
      error: (error) => {
        Swal.fire({
          title: 'Error!',
          text: error.message,
          icon: 'error',
          confirmButtonText: 'Ok'
        })
      }
    });
      
    
  }


}
