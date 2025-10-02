export default class PutPedido {
  constructor(pedidoRepository) {
    this.pedidoRepository = pedidoRepository;
  }

  async execute(idPedido, data) {
    // 1. Buscar pedido existente
    const pedidoExistente = await this.pedidoRepository.getByIdPedido(idPedido);
    if (!pedidoExistente) {
      throw new Error("Pedido no encontrado");
    }

    // 2. Actualizar campos permitidos
    pedidoExistente.estado = data.estado || pedidoExistente.estado;
    pedidoExistente.detalles = data.detalles || pedidoExistente.detalles;
    pedidoExistente.total = data.total || pedidoExistente.total;
    pedidoExistente.createdAt = data.createdAt || pedidoExistente.createdAt;

    // 3. Guardar cambios en repositorio
    const pedidoActualizado = await this.pedidoRepository.updateByIdPedido(
      idPedido,
      pedidoExistente
    );

    return pedidoActualizado;
  }
}
