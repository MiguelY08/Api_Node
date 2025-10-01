export default class GetProductoById {
    constructor(productoRepository) {
        this.productoRepository = productoRepository
    }
    async execute(idProducto) {
        return await this.productoRepository.findByIdProducto(idProducto)
    }
} 