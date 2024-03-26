import { Injectable } from '@angular/core';
import { Conexion } from '../../classes/clase_conexion';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';
import { C_Medico } from '../../classes/clase_medico';
@Injectable({
  providedIn: 'root'
})
export class MedicosService {
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

  Guardar_Medico(medico : C_Medico, cve_vendedor : string){
    let res =  this.http.post(`${this.url}medicos.php`, {"evento":"guardar_medico", "medico": medico, "cve_vendedor": cve_vendedor});
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

  Editar_Medico(medico : C_Medico, cve_vendedor : string){
    let res =  this.http.post(`${this.url}medicos.php`, {"evento":"editar_medico", "medico": medico, "cve_vendedor": cve_vendedor});
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


  Buscar_Medicos(valor : string, cve_vendedor : string){
    let res =  this.http.post(`${this.url}medicos.php`, {"evento":"buscar_medicos", "val": valor, "cve_vendedor": cve_vendedor});
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
