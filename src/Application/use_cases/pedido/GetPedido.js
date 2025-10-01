export default class GetPedido {
    constructor(pedidoRepository) {
        this.pedidoRepository = pedidoRepository
    }
    async execute() {
        return await this.pedidoRepository.getAll()
    }
}