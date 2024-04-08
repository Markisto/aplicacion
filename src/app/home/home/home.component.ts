import { CommonModule } from '@angular/common';
import { Component,OnInit, TemplateRef, ViewChild, inject  } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {RouterModule, Router, NavigationEnd} from '@angular/router';
import { Subscription, filter } from 'rxjs';
import {NgbOffcanvas, OffcanvasDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { LoginService } from '../../login/login/login.service';

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



  private offcanvasService = inject(NgbOffcanvas);
	closeResult = '';

  constructor(private router: Router,private sesionservice : LoginService) {}
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

  Salir(reason: any){
    this.offcanvasService.dismiss(reason);
    
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



  open(content: TemplateRef<any>) {
		this.offcanvasService.open(content, { ariaLabelledBy: 'offcanvas-basic-title' }).result.then(
			(result) => {
				this.closeResult = `Closed with: ${result}`;
			},
			(reason) => {
				this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
			},
		);
	}

	private getDismissReason(reason: any): string {
		switch (reason) {
			case OffcanvasDismissReasons.ESC:
				return 'by pressing ESC';
			case OffcanvasDismissReasons.BACKDROP_CLICK:
				return 'by clicking on the backdrop';
			default:
				return `with: ${reason}`;
		}
	}









}
