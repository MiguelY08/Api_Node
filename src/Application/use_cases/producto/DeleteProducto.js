export default class DeleteProducto {
    /**
     * Constructor for DeleteProducto class.
     * @param {ProductoRepository} productoRepository - The product repository to be used.
     * The constructor will initialize the product repository.
     */
    constructor(productoRepository) {
        this.productoRepository = productoRepository
    }
    /**
     * Deletes a product from the product repository.
     * @param {string} id - The id of the product to be deleted.
     * @return {Promise<void>} - A promise that will be resolved when the product has been deleted.
     * @throws {Error} - If there is an error executing the query.
     */
    async execute(idProducto) {
        return await this.productoRepository.deleteByIdProducto(idProducto) 
    }
}