// import { Pedido } from "../../Domain/models/Pedido.js";
export default class GetPedidoById {
    constructor(pedidoRepository) {
        this.pedidoRepository = pedidoRepository
    }
    execute(idPedido) {
        return this.pedidoRepository.getByIdPedido(idPedido)
    }
}