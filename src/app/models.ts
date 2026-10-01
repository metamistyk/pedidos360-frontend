export interface Producto {
  id?: number;
  nombre: string;
  precio: number;
  stock: number;
}

export interface ItemPedido {
  productoId: number;
  cantidad: number;
}

export type EstadoPedido =
  'CREADO' | 'ACEPTADO' | 'EN_PREPARACION' | 'DESPACHADO' | 'ENTREGADO' | 'CANCELADO';

export interface Pedido {
  id?: number;
  clienteId?: string;
  estado?: EstadoPedido;
  fechaCreacion?: string;
  items: { producto: Producto; cantidad: number; precioUnitario: number }[];
}