import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { ItemPedido, Pedido } from './models';

@Injectable({ providedIn: 'root' })
export class PedidosService {
  private readonly base = `${environment.apiBaseUrl}/api/orders`;

  constructor(private http: HttpClient) {}

  listar(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(this.base);
  }

  crear(items: ItemPedido[]): Observable<Pedido> {
    return this.http.post<Pedido>(this.base, { items });
  }

  cambiarEstado(id: number, nuevoEstado: string): Observable<Pedido> {
    return this.http.put<Pedido>(`${this.base}/${id}/status`, { nuevoEstado });
  }
}