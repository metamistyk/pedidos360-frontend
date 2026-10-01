import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PedidosService } from '../pedidos.service';
import { CatalogoService } from '../catalogo.service';
import { AuthRolesService } from '../auth-roles.service';
import { Pedido, Producto, ItemPedido, EstadoPedido } from '../models';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="tarjeta">
      <h2>Pedidos</h2>

      <div class="crear-pedido">
        <h3>Crear pedido</h3>
        <div *ngFor="let item of itemsNuevoPedido; let i = index" class="fila-item">
          <select [(ngModel)]="item.productoId">
            <option *ngFor="let p of productos" [value]="p.id">{{ p.nombre }} (stock: {{ p.stock }})</option>
          </select>
          <input type="number" min="1" [(ngModel)]="item.cantidad" placeholder="Cantidad" />
          <button (click)="quitarItem(i)">Quitar</button>
        </div>
        <button (click)="agregarItem()">+ Agregar producto</button>
        <button (click)="crearPedido()" [disabled]="itemsNuevoPedido.length === 0">Crear pedido</button>
      </div>

      <h3>Listado</h3>
      <table class="tabla">
        <thead>
          <tr><th>ID</th><th>Estado</th><th>Fecha</th><th>Detalle</th><th *ngIf="puedeGestionar()">Acción</th></tr>
        </thead>
        <tbody>
          <tr *ngFor="let pedido of pedidos">
            <td>{{ pedido.id }}</td>
            <td>{{ pedido.estado }}</td>
            <td>{{ pedido.fechaCreacion | date:'short' }}</td>
            <td>
              <ul style="margin:0;padding-left:18px;">
                <li *ngFor="let item of pedido.items">
                  {{ item.producto.nombre }} × {{ item.cantidad }}
                </li>
              </ul>
            </td>
            <td *ngIf="puedeGestionar()">
              <select [(ngModel)]="nuevoEstado[pedido.id!]">
                <option value="ACEPTADO">ACEPTADO</option>
                <option value="EN_PREPARACION">EN_PREPARACION</option>
                <option value="DESPACHADO">DESPACHADO</option>
                <option value="ENTREGADO">ENTREGADO</option>
                <option value="CANCELADO">CANCELADO</option>
              </select>
              <button (click)="cambiarEstado(pedido.id!)">Actualizar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  `
})
export class Orders implements OnInit {
  pedidos: Pedido[] = [];
  productos: Producto[] = [];
  itemsNuevoPedido: ItemPedido[] = [];
  nuevoEstado: Record<number, EstadoPedido> = {};

  constructor(
    private pedidosService: PedidosService,
    private catalogoService: CatalogoService,
    public authRoles: AuthRolesService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarPedidos();
    this.catalogoService.listar().subscribe(p => {
      this.productos = p;
      this.cdr.markForCheck();
    });
  }

  cargarPedidos(): void {
    this.pedidosService.listar().subscribe(p => {
      this.pedidos = p;
      this.cdr.markForCheck();
    });
  }

  puedeGestionar(): boolean {
    return this.authRoles.tiene('Operador') || this.authRoles.tiene('Admin');
  }

  agregarItem(): void {
    this.itemsNuevoPedido.push({ productoId: this.productos[0]?.id ?? 0, cantidad: 1 });
    this.cdr.markForCheck();
  }

  quitarItem(i: number): void {
    this.itemsNuevoPedido.splice(i, 1);
    this.cdr.markForCheck();
  }

  crearPedido(): void {
    this.pedidosService.crear(this.itemsNuevoPedido).subscribe(() => {
      this.itemsNuevoPedido = [];
      this.cargarPedidos();
    });
  }

  cambiarEstado(id: number): void {
    const estado = this.nuevoEstado[id];
    if (!estado) return;
    this.pedidosService.cambiarEstado(id, estado).subscribe(() => this.cargarPedidos());
  }
}