export default class PostProducto {
    constructor(productoRepository) {
        this.productoRepository = productoRepository
    }

    async execute(producto) {
        console.log("Datos recibidos en PostProducto UseCase:", producto);
        console.log("Tipo de dato:", typeof producto);
        console.log("Keys del objeto:", Object.keys(producto || {}));
        
        return await this.productoRepository.create(producto) 
    }
}