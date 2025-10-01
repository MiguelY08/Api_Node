import mongoose from "mongoose";

const ProductoSchema = new mongoose.Schema({
    idProducto: { type: String, required: true, unique: true },
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    precio: { type: Number, required: true },
    stock: { type: Number, required: true },
    categoria: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const ProductoModel = mongoose.model("Producto", ProductoSchema);

class ProductoRepositoryMongo {
    async create(data) {
        return await ProductoModel.create(data);
    }

    async findAll() {
        return await ProductoModel.find();
    }

    async findByIdProducto(idProducto) {
        return await ProductoModel.findOne({ idProducto });
    }

    async updateByIdProducto(idProducto, data) {
        return await ProductoModel.findOneAndUpdate(
            { idProducto },
            data,
            { new: true }
        );
    }

    async deleteByIdProducto(idProducto) {
        return await ProductoModel.findOneAndDelete({ idProducto });
    }

    // incrementar stock
    async incrementarStock(idProducto, cantidad) {
        const productoDoc = await ProductoModel.findOneAndUpdate(
            { idProducto },
            { $inc: { stock: cantidad } }, // incrementa el stock
            { new: true }
        );
        return productoDoc;
    }
}

export default ProductoRepositoryMongo;
