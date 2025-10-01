class PedidoDetalle {
    /**
     * Constructor for PedidoDetalle class.
     * @param {Object} options - Options for the constructor.
     * @param {number} options.idPedidoDetalle - The id of the pedido detalle.
     * @param {number} options.idPedido - The id of the pedido.
     * @param {number} options.idProducto - The id of the producto.
     * @param {number} options.cantidad - The quantity of the producto.
     * @param {number} options.precioUnitario - The unit price of the producto.
     */
    constructor({idPedidoDetalle, idPedido, idProducto, cantidad, precioUnitario}) {
        this.idPedidoDetalle = idPedidoDetalle;
        this.idPedido = idPedido;
        this.idProducto = idProducto;
        this.cantidad = cantidad;
        this.precioUnitario = precioUnitario;
        this.subtotal = (cantidad * precioUnitario);
    }
}

export default PedidoDetalle;

