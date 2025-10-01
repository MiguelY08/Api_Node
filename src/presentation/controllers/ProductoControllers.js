import GetProductoUseCase from "../../Application/use_cases/producto/GetProducto.js"
import GetProductoByIdUseCase from "../../Application/use_cases/producto/GetProductoById.js"
import PostProductoUseCase from "../../Application/use_cases/producto/PostProducto.js"
import PutProductoUseCase from "../../Application/use_cases/producto/PutProducto.js"
import DeleteProductoUseCase from "../../Application/use_cases/producto/DeleteProducto.js"

import ProductoRepository from "../../infrastructure/repositories/ProductoRepositoryMongo.js"

const productoRepository = new ProductoRepository();

export const PostProducto = async (req, res) => {
    try {
        console.log("Request body:", req.body);
        const producto = req.body;
        
        // Validación básica
        if (!producto || Object.keys(producto).length === 0) {
            return res.status(400).json({ error: "El cuerpo de la petición está vacío" });
        }
        
        const useCase = new PostProductoUseCase(productoRepository);
        const newProducto = await useCase.execute(producto);
        res.status(201).json(newProducto);
    } catch (error) {
        console.error("Error en PostProducto:", error);
        res.status(500).json({ error: error.message });
    }
}

export const GetProducto = async (req, res) => {
    try {
        const useCase = new GetProductoUseCase(productoRepository);
        const productos = await useCase.execute();
        res.status(200).json(productos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const GetProductoById = async (req, res) => {
    try {
        const useCase = new GetProductoByIdUseCase(productoRepository);
        const producto = await useCase.execute(req.params.id);
        if (!producto) return res.status(404).json({ message: "Producto no encontrado" });
        res.json(producto);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const PutProducto = async (req, res) => {
    try {
        const useCase = new PutProductoUseCase(productoRepository);
        const producto = await useCase.execute(req.params.id, req.body);
        if (!producto) return res.status(404).json({ message: "Producto no encontrado" });
        res.json(producto);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const DeleteProducto = async (req, res) => {
    try {
        const useCase = new DeleteProductoUseCase(productoRepository);
        const producto = await useCase.execute(req.params.id);
        if (!producto) return res.status(404).json({ message: "Producto no encontrado" });
        res.json(producto);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}