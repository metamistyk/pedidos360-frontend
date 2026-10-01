import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PedidosService } from '../pedidos.service';
import { CatalogoService } from '../catalogo.service';
import { AuthRolesService } from '../auth-roles.service';
import { Pedido, Producto } from '../models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="tarjeta">
      <h2>Dashboard</h2>
      <p>Rol activo: <strong>{{ authRoles.roles.join(', ') || 'Sin rol asignado' }}</strong></p>
      <div class="resumen">
        <div class="metrica"><h3>{{ pedidos.length }}</h3><p>Pedidos visibles</p></div>
        <div class="metrica"><h3>{{ productos.length }}</h3><p>Productos en catálogo</p></div>
      </div>
    </section>
  `
})
export class Dashboard implements OnInit {
  pedidos: Pedido[] = [];
  productos: Producto[] = [];

  constructor(
    private pedidosService: PedidosService,
    private catalogoService: CatalogoService,
    public authRoles: AuthRolesService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.pedidosService.listar().subscribe(p => {
      this.pedidos = p;
      this.cdr.markForCheck();
    });
    this.catalogoService.listar().subscribe(p => {
      this.productos = p;
      this.cdr.markForCheck();
    });
  }
}