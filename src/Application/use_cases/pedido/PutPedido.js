export default class PutPedido {
  constructor(pedidoRepository, productoRepository) {
    this.pedidoRepository = pedidoRepository;
    this.productoRepository = productoRepository;
  }

  async execute(idPedido, updateData) {
    // Buscar el pedido actual
    const pedidoActual = await this.pedidoRepository.getByIdPedido(idPedido);
    if (!pedidoActual) throw new Error(`Pedido con ID ${idPedido} no encontrado`);

    // Si se actualizan los detalles, manejar stock
    if (updateData.detalles && Array.isArray(updateData.detalles)) {
      await this.manejarCambiosStock(pedidoActual.detalles, updateData.detalles);
    }

    // Mantener fecha de creación original
    updateData.createdAt = pedidoActual.createdAt;

    // Actualizar pedido
    return await this.pedidoRepository.updateByIdPedido(idPedido, updateData);
  }

  async manejarCambiosStock(detallesAnteriores, detallesNuevos) {
    // Crear mapas para comparar cantidades
    const mapAnterior = new Map();
    const mapNuevo = new Map();

    detallesAnteriores.forEach(d => {
      mapAnterior.set(d.idProducto, d.cantidad);
    });

    detallesNuevos.forEach(d => {
      mapNuevo.set(d.idProducto, d.cantidad);
    });

    // Revisar cada producto nuevo
    for (const [idProducto, cantidadNueva] of mapNuevo) {
      const cantidadAnterior = mapAnterior.get(idProducto) || 0;
      const diferencia = cantidadNueva - cantidadAnterior;

      if (diferencia > 0) {
        // Se añadieron más productos → descontar stock
        const producto = await this.productoRepository.findByIdProducto(idProducto);
        if (!producto) throw new Error(`Producto ${idProducto} no encontrado`);

        if (producto.stock < diferencia) {
          throw new Error(
            `Stock insuficiente para el producto ${idProducto}. Disponible: ${producto.stock}, requerido: ${diferencia}`
          );
        }

        await this.productoRepository.updateByIdProducto(idProducto, {
          stock: producto.stock - diferencia,
        });
      } else if (diferencia < 0) {
        // Se redujo cantidad → devolver stock
        await this.productoRepository.incrementarStock(idProducto, Math.abs(diferencia));
      }
    }

    // Productos eliminados del pedido → devolver todo el stock anterior
    for (const [idProducto, cantidadAnterior] of mapAnterior) {
      if (!mapNuevo.has(idProducto)) {
        await this.productoRepository.incrementarStock(idProducto, cantidadAnterior);
      }
    }
  }
}
