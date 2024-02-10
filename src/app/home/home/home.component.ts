import { CommonModule } from '@angular/common';
import { Component,OnInit  } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {RouterModule, Router} from '@angular/router';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatIconModule , RouterModule, CommonModule ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent  implements OnInit{
  page = "INICIO";
  ruta = "";
  constructor(private router: Router) {}
  ngOnInit(): void {
    console.log(this.router.url);
    this.ruta = this.router.url;
  }
  logout() {
    this.router.navigate(['login']);
  }








}
