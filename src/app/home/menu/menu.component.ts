import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {

  user = 'Carmen'

  constructor(private router: Router) { }

  Navegar(menu : string){
    this.router.navigate([`home/${menu}`]);
  }

}
