import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';
import { Conexion } from '../../classes/clase_conexion';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private islogin = new BehaviorSubject<boolean>(false);
  conect = new Conexion();
  url = this.conect.get_url();
  constructor(private http: HttpClient) { }

  get isLogin() : Observable<boolean> {
    return this.islogin.asObservable();
  }

  InicioSesion(usuario: string, clave: string) {
    let res =  this.http.post(`${this.url}login.php`, { "usuario": usuario, "password": clave});
    return res
      .pipe(
        tap((res:any) => {          
          if(res != null){
            this.islogin.next(true);
          }else{
            this.islogin.next(false);
          }
        }),
        catchError((err) => {         
          return throwError(()=> err);
        })

      )
  }

}
