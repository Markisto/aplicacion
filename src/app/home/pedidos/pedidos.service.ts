import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';
import { Conexion } from '../../classes/clase_conexion';


@Injectable({
  providedIn: 'root'
})
export class PedidosService {
  conect = new Conexion();
  url = this.conect.get_url();
  constructor(private http: HttpClient) { }

  Obtener_Sucursales(){
    let res =  this.http.post(`${this.url}pedidos.php`, {"evento":"obtener_sucursales"});
    return res
    .pipe(
      tap((res: any) => {
        return res;
      }),
      catchError((err) => {
        return throwError(() => err);
      })
    )
  }

  Obtener_Clientes(nombre : string,cve_usuario : string){
    let res =  this.http.post(`${this.url}pedidos.php`, {"evento":"obtener_responsables",  "usuario": nombre ,"cve_vendedor": cve_usuario});
    return res
    .pipe(
      tap((res: any) => {
        return res;
      }),
      catchError((err) => {
        return throwError(() => err);
      })
    )
  }

  Obtener_Tipo_Pago(){
    let res =  this.http.post(`${this.url}pedidos.php`, {"evento":"obtener_tipo_pago"});
    return res
    .pipe(
      tap((res: any) => {
        return res;
      }),
      catchError((err) => {
        return throwError(() => err);
      })
    )
  }

  Obtener_Tipo_Cliente(){
    let res =  this.http.post(`${this.url}pedidos.php`, {"evento":"obtener_tipo_cliente"});
    return res
    .pipe(
      tap((res: any) => {
        return res;
      }),
      catchError((err) => {
        return throwError(() => err);
      })
    )
  }

}
