export default class PutPedidoUseCase {
  constructor(pedidoRepository, productoRepository) {
    this.pedidoRepository = pedidoRepository;
    this.productoRepository = productoRepository;
  }

  async execute(idPedido, data) {
    // 1. Buscar pedido existente
    const pedidoExistente = await this.pedidoRepository.getByIdPedido(idPedido);
    if (!pedidoExistente) {
      throw new Error("Pedido no encontrado");
    }

    // 2. Ajustar stock comparando viejo vs nuevo
    const detallesAntiguos = pedidoExistente.detalles || [];
    const detallesNuevos = data.detalles || [];

    // Recorremos los productos nuevos
    for (const detalleNuevo of detallesNuevos) {
      const detalleAntiguo = detallesAntiguos.find(
        (d) => d.idProducto === detalleNuevo.idProducto
      );

      if (detalleAntiguo) {
        // Ya existía → ver diferencia
        const diferencia = detalleNuevo.cantidad - detalleAntiguo.cantidad;
        if (diferencia > 0) {
          // Aumentó la cantidad → descontar más stock
          await this.productoRepository.descontarStock(
            detalleNuevo.idProducto,
            diferencia
          );
        } else if (diferencia < 0) {
          // Bajó la cantidad → devolver stock
          await this.productoRepository.incrementarStock(
            detalleNuevo.idProducto,
            Math.abs(diferencia)
          );
        }
      } else {
        // Producto nuevo en el pedido → descontar stock
        await this.productoRepository.descontarStock(
          detalleNuevo.idProducto,
          detalleNuevo.cantidad
        );
      }
    }

    // Recorremos los productos eliminados
    for (const detalleAntiguo of detallesAntiguos) {
      const sigueExistiendo = detallesNuevos.find(
        (d) => d.idProducto === detalleAntiguo.idProducto
      );
      if (!sigueExistiendo) {
        // Se eliminó este producto del pedido → devolver stock completo
        await this.productoRepository.incrementarStock(
          detalleAntiguo.idProducto,
          detalleAntiguo.cantidad
        );
      }
    }

    // 3. Actualizar datos del pedido
    pedidoExistente.estado = data.estado || pedidoExistente.estado;
    pedidoExistente.detalles = detallesNuevos;
    pedidoExistente.total = data.total || pedidoExistente.total;
    pedidoExistente.createdAt = data.createdAt || pedidoExistente.createdAt;

    // 4. Guardar cambios en repositorio
    const pedidoActualizado = await this.pedidoRepository.updateByIdPedido(
      idPedido,
      pedidoExistente
    );

    return pedidoActualizado;
  }
}
