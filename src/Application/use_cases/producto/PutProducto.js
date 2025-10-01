export default class PutProducto {
  constructor(productoRepository) {
    this.productoRepository = productoRepository;
  }
  async execute(idProducto, data) {
    return await this.productoRepository.updateByIdProducto(idProducto, data);
  }
}
