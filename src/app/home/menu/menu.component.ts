import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { C_Usuario } from '../../classes/clase_usuario';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit {

  user = new C_Usuario("","","","","");

  
  constructor(private router: Router) { }
  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem('user') || '{}');
    if(this.user.cve_usuario == ""){
      this.router.navigate(['login']);
    }
  }

  Navegar(menu : string){
    console.log("ruta");
    console.log(menu);  
    this.router.navigate([`home/${menu}`]);
  }

  

}
