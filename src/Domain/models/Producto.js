// src/Domain/entities/Producto.js
class Producto {
  constructor({ idProducto, nombre, stock, precio, categoria, descripcion }) {
    this.idProducto = idProducto;
    this.nombre = nombre;
    this.stock = stock;
    this.precio = precio;
    this.categoria = categoria;
    this.descripcion = descripcion;
    this.createdAt = new Date();
  }

  descontarStock(cantidad) {
    if (this.stock < cantidad) {
      throw new Error(`Stock insuficiente para el producto ${this.nombre}`);
    }
    this.stock -= cantidad;
  }
}

export default Producto;
