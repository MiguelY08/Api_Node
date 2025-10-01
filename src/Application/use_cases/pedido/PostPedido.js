// src/Application/use_cases/pedido/PostPedidoUseCase.js
import Pedido from "../../../Domain/models/Pedido.js";
import Producto from "../../../Domain/models/Producto.js";

export default async function CrearPedido(pedidoRepository, productoRepository, pedidoData) {
  // Crear entidad pedido
  const pedido = new Pedido(pedidoData);

  // Recorrer detalles del pedido
  for (const detalle of pedido.detalles) {
    // Buscar producto por idProducto
    const data = await productoRepository.findByIdProducto(detalle.idProducto);
    if (!data) throw new Error(`Producto ${detalle.idProducto} no encontrado`);

    // Crear entidad Producto y descontar stock
    const producto = new Producto(data);
    producto.descontarStock(detalle.cantidad);

    // Guardar cambios en Mongo (stock actualizado)
    await productoRepository.updateByIdProducto(producto.idProducto, { stock: producto.stock });
  }

  // Guardar el pedido SOLO después de procesar todos los detalles
  return await pedidoRepository.create(pedido);
}
