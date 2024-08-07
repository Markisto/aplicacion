import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';
import { Conexion } from '../../classes/clase_conexion';
import { C_Responsable } from '../../classes/clase_responsable';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  conect = new Conexion();
  url = this.conect.get_url();
  constructor(private http: HttpClient) { }

  Obtener_Direcciones(cp : string){
    let res =  this.http.post(`${this.url}clientes.php`, {"evento":"buscar_direccion", "codigo_postal": cp});
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

  Cargar_Usos_CFDI(){
    let res =  this.http.post(`${this.url}clientes.php`, {"evento":"obtener_usos_cfdi"});
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

  Cargar_Regimenes_Fiscales(){
    let res =  this.http.post(`${this.url}clientes.php`, {"evento":"obtener_regimenes_fiscales"});
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

  Cargar_Formas_Pago(){
    let res =  this.http.post(`${this.url}clientes.php`, {"evento":"obtener_formas_pago"});
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

  Cargar_Clases_Cliente(){
    let res =  this.http.post(`${this.url}clientes.php`, {"evento":"obtener_clases_cliente"});
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

  Cargar_Medicos(cve_vendedor: string){
    let res =  this.http.post(`${this.url}clientes.php`, {"evento":"obtener_medicos","cve_vendedor":  cve_vendedor});
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


  Buscar_Productos(descripcion : string, cve_sucursal : string, tipo_cliente : string){
    let res =  this.http.post(`${this.url}pedidos.php`, {"evento":"buscar_productos", "descripcion": descripcion, "cve_sucursal": "", "tipo_cliente": ""});
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

  Guardar_Cliente(cliente : C_Responsable, usuario : string){
    let res =  this.http.post(`${this.url}clientes.php`, {"evento":"guardar_cliente", "cliente": cliente, "usuario": usuario});
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

  Modificar_Cliente(cliente : C_Responsable, usuario : string){
    let res =  this.http.post(`${this.url}clientes.php`, {"evento":"modificar_cliente", "cliente": cliente, "usuario": usuario});
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



  Buscar_Clientes(valor : string, cve_usuario : string){
    let res =  this.http.post(`${this.url}clientes.php`, {"evento":"buscar_clientes", "valor": valor, "cve_usuario": cve_usuario});
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

  Cargar_Direcciones(cve_cliente : string){
    let res =  this.http.post(`${this.url}clientes.php`, {"evento":"cargar_direcciones", "cve_cliente": cve_cliente});
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


  Agregar_Direccion_Update(cve_cliente : string, direccion : any){
    let res =  this.http.post(`${this.url}clientes.php`, {"evento":"agregar_direccion_update", "cve_cliente": cve_cliente, "direccion": direccion});
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

  Quitar_Direccion_Update(cve_cliente : string , cve_consignatario : string){
    let res =  this.http.post(`${this.url}clientes.php`, {"evento":"quitar_direccion_update", "cve_cliente": cve_cliente, "cve_consignatario": cve_consignatario});
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
