import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CatalogoService } from '../catalogo.service';
import { AuthRolesService } from '../auth-roles.service';
import { Producto } from '../models';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="tarjeta">
      <h2>Catálogo de productos</h2>

      <div *ngIf="authRoles.tiene('Admin')" class="crear-producto">
        <h3>Nuevo producto</h3>
        <label>
          Nombre
          <input [(ngModel)]="nuevoProducto.nombre" placeholder="Ej: Pan amasado" />
        </label>
        <label>
          Precio
          <input type="number" [(ngModel)]="nuevoProducto.precio" placeholder="Ej: 1500" />
        </label>
        <label>
          Stock
          <input type="number" [(ngModel)]="nuevoProducto.stock" placeholder="Ej: 50" />
        </label>
        <button (click)="crear()">Crear producto</button>
      </div>

      <table class="tabla">
        <thead><tr><th>ID</th><th>Nombre</th><th>Precio</th><th>Stock</th><th *ngIf="authRoles.tiene('Admin')">Acción</th></tr></thead>
        <tbody>
          <tr *ngFor="let p of productos">
            <td>{{ p.id }}</td>
            <td><input [(ngModel)]="p.nombre" [disabled]="!authRoles.tiene('Admin')" /></td>
            <td><input type="number" [(ngModel)]="p.precio" [disabled]="!authRoles.tiene('Admin')" /></td>
            <td><input type="number" [(ngModel)]="p.stock" [disabled]="!authRoles.tiene('Admin')" /></td>
            <td *ngIf="authRoles.tiene('Admin')"><button (click)="actualizar(p)">Guardar</button></td>
          </tr>
        </tbody>
      </table>
    </section>
  `
})
export class Catalog implements OnInit {
  productos: Producto[] = [];
  nuevoProducto: Producto = { nombre: '', precio: 0, stock: 0 };

  constructor(
    private catalogoService: CatalogoService,
    public authRoles: AuthRolesService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.catalogoService.listar().subscribe(p => {
      this.productos = p;
      this.cdr.markForCheck();
    });
  }

  crear(): void {
    this.catalogoService.crear(this.nuevoProducto).subscribe(() => {
      this.nuevoProducto = { nombre: '', precio: 0, stock: 0 };
      this.cargar();
    });
  }

  actualizar(p: Producto): void {
    this.catalogoService.actualizar(p.id!, p).subscribe(() => this.cargar());
  }
}