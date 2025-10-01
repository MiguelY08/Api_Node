export default class GetProducto {
/**
 * Constructor for GetProducts class.
 * @param {ProductoRepository} productoRepository - The product repository to be used.
 the constructor will initialize the product repository.
 */
    constructor(productoRepository) {
        this.productoRepository = productoRepository
    }

/**
 * Returns all products from the product repository.
 * @return {Array<Product>}
 * @throws {Error} - If there is an error executing the query.
 */
    async execute() {
        return await this.productoRepository.findAll()
    }

}