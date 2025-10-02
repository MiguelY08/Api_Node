
export class PutPedidoUseCase {
  constructor(pedidoRepository, productoRepository) {
    this.pedidoRepository = pedidoRepository;
    this.productoRepository = productoRepository;
  }

  async execute(idPedido, updateData) {
    console.log("PutPedidoUseCase - Buscando pedido con ID:", idPedido);
    const pedidoActual = await this.pedidoRepository.getByIdPedido(idPedido);
    console.log("PutPedidoUseCase - Pedido encontrado:", pedidoActual);
    
    if (!pedidoActual) throw new Error(`Pedido con ID ${idPedido} no encontrado`);

    // Si se están actualizando detalles, manejar diferencias de stock
    if (updateData.detalles && Array.isArray(updateData.detalles)) {
      console.log("PutPedidoUseCase - Actualizando detalles, manejando stock");
      await this.manejarCambiosStock(pedidoActual.detalles, updateData.detalles);
    }

    console.log("PutPedidoUseCase - Actualizando con datos:", updateData);
    return await this.pedidoRepository.updateByIdPedido(idPedido, updateData);
  }

  async manejarCambiosStock(detallesAnteriores, detallesNuevos) {
    const mapAnterior = new Map();
    const mapNuevo = new Map();

    detallesAnteriores.forEach(detalle => {
      mapAnterior.set(detalle.idProducto, detalle.cantidad);
    });

    detallesNuevos.forEach(detalle => {
      mapNuevo.set(detalle.idProducto, detalle.cantidad);
    });

    for (const [idProducto, cantidadNueva] of mapNuevo) {
      const cantidadAnterior = mapAnterior.get(idProducto) || 0;
      const diferencia = cantidadNueva - cantidadAnterior;

      console.log(`Producto ${idProducto}: anterior ${cantidadAnterior}, nueva ${cantidadNueva}, diferencia ${diferencia}`);

      if (diferencia > 0) {
        // Más cantidad → descontar stock
        const producto = await this.productoRepository.getByIdProducto(idProducto);
        if (!producto) throw new Error(`Producto ${idProducto} no encontrado`);

        if (producto.stock < diferencia) {
          throw new Error(`Stock insuficiente para el producto ${idProducto}. Disponible: ${producto.stock}, requerido: ${diferencia}`);
        }

        await this.productoRepository.updateByIdProducto(idProducto, { 
          stock: producto.stock - diferencia 
        });
      } else if (diferencia < 0) {
        // Menos cantidad → devolver stock
        await this.productoRepository.updateIncrementarStock(idProducto, Math.abs(diferencia));
      }
    }

    // Productos eliminados totalmente
    for (const [idProducto, cantidadAnterior] of mapAnterior) {
      if (!mapNuevo.has(idProducto)) {
        console.log(`Producto ${idProducto} eliminado, devolviendo ${cantidadAnterior} unidades`);
        await this.productoRepository.updateIncrementarStock(idProducto, cantidadAnterior);
      }
    }
  }
}


// =======================
// CANCELAR Pedido
// =======================
export default class CancelarPedido {
  constructor(pedidoRepository, productoRepository) {
    this.pedidoRepository = pedidoRepository;
    this.productoRepository = productoRepository;
  }

  async execute(idPedido) {
    console.log("CancelarPedido - Buscando pedido con ID:", idPedido);

    const pedido = await this.pedidoRepository.getByIdPedido(idPedido);
    if (!pedido) throw new Error("Pedido no encontrado");

    if (pedido.estado === "cancelado") {
      throw new Error("El pedido ya está cancelado");
    }

    console.log("CancelarPedido - Devolviendo stock de productos");
    for (const detalle of pedido.detalles) {
      console.log(`Devolviendo ${detalle.cantidad} unidades del producto ${detalle.idProducto}`);
      await this.productoRepository.updateIncrementarStock(
        detalle.idProducto,
        detalle.cantidad
      );
    }

    pedido.estado = "cancelado";
    return await this.pedidoRepository.updateByIdPedido(idPedido, pedido);
  }
}
