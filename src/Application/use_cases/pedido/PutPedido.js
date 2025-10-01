export default class CancelarPedido {
  constructor(pedidoRepository, productoRepository) {
    this.pedidoRepository = pedidoRepository;
    this.productoRepository = productoRepository;
  }

  async execute(idPedido) {
    // 1. Buscar pedido
    const pedido = await this.pedidoRepository.getByIdPedido(idPedido);
    if (!pedido) throw new Error("Pedido no encontrado");

    // 2. Validar si ya está cancelado
    if (pedido.estado === "cancelado") {
      throw new Error("El pedido ya está cancelado");
    }

    // 3. Devolver stock de cada detalle
    for (const detalle of pedido.detalles) {
      await this.productoRepository.incrementarStock(
        detalle.idProducto,
        detalle.cantidad
      );
    }

    // 4. Actualizar estado del pedido
    pedido.estado = "cancelado";

    return await this.pedidoRepository.updateByIdPedido(idPedido, pedido);
  }
}
