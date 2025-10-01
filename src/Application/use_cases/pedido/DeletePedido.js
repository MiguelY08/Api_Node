export default class DeletePedido {
    constructor(pedidoRepository) {
        this.pedidoRepository = pedidoRepository
    }

    async execute(idPedido) {
        return await this.pedidoRepository.deleteByIdPedido(idPedido)
    }
}