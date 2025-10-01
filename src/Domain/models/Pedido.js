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
    constructor({ idPedidoDetalle, idPedido, idProducto, cantidad, precioUnitario }) {
        this.idPedidoDetalle = idPedidoDetalle;
        this.idPedido = idPedido;
        this.idProducto = idProducto;
        this.cantidad = cantidad;
        this.precioUnitario = precioUnitario;
        this.subtotal = cantidad * precioUnitario;
    }
}

class Pedido {
    constructor({ idPedido, idUsuario, estado, createdAt = new Date(), detalles = [] }) {
        this.idPedido = idPedido;
        this.idUsuario = idUsuario;
        this.estado = estado;
        this.createdAt = createdAt instanceof Date ? createdAt : new Date(createdAt);
        this.detalles = detalles.map(d => d instanceof PedidoDetalle ? d : new PedidoDetalle(d));
        this.calcularTotal(); // Calcula el total al crear el pedido
    }

    // Método para agregar un detalle al pedido
    agregarDetalle(detalle) {
        const pedidoDetalle = detalle instanceof PedidoDetalle ? detalle : new PedidoDetalle(detalle);
        this.detalles.push(pedidoDetalle);
        this.calcularTotal();
    }

    // Método para calcular el total basado en los detalles
    calcularTotal() {
        this.total = this.detalles.reduce((sum, detalle) => sum + detalle.subtotal, 0);
    }
}

export { Pedido, PedidoDetalle };
export default Pedido;