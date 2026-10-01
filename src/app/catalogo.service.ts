import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Producto } from './models';

@Injectable({ providedIn: 'root' })
export class CatalogoService {
  private readonly base = `${environment.apiBaseUrl}/api/catalog/products`;

  constructor(private http: HttpClient) {}

  listar(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.base);
  }

  crear(producto: Producto): Observable<Producto> {
    return this.http.post<Producto>(this.base, producto);
  }

  actualizar(id: number, producto: Producto): Observable<Producto> {
    return this.http.put<Producto>(`${this.base}/${id}`, producto);
  }
}