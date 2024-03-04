import { CommonModule } from '@angular/common';
import { Component,OnInit  } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {RouterModule, Router, NavigationEnd} from '@angular/router';
import { Subscription, filter } from 'rxjs';


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
  init = 1;
  subscriber: Subscription | undefined;
  constructor(private router: Router) {}
  ngOnInit(): void {
    this.ruta = this.router.url;
    this.page = this.ruta.replace("/home/","").toUpperCase();
    this.subscriber = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event : any) => {
      this.ruta = event.url;
       console.log('The URL changed to: ' + event['url'])
       this.page = event['url'].replace("/home/","").toUpperCase();
    });
  }

  ngAfterViewInit() {
    console.log("Cambio ruta ")
  }

  logout() {
    this.router.navigate(['login']);
  }










}
