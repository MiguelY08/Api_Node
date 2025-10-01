import GetPedidoUseCase from "../../Application/use_cases/pedido/GetPedido.js";
import GetPedidoByIdUseCase from "../../Application/use_cases/pedido/GetPedidoById.js";
import CrearPedido from "../../Application/use_cases/pedido/PostPedido.js";
import PutPedidoUseCase from "../../Application/use_cases/pedido/PutPedido.js";
import CancelarPedido from "../../Application/use_cases/pedido/PutPedido.js";

import PedidoRepository from "../../infrastructure/repositories/PedidoRepositoryMongo.js";
import ProductoRepository from "../../infrastructure/repositories/ProductoRepositoryMongo.js";

const pedidoRepository = new PedidoRepository();
const productoRepository = new ProductoRepository();

export const GetPedido = async (req, res) => {
  try {
    const useCase = new GetPedidoUseCase(pedidoRepository);
    const pedidos = await useCase.execute();
    res.status(200).json(pedidos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const GetPedidoById = async (req, res) => {
  try {
    const useCase = new GetPedidoByIdUseCase(pedidoRepository);
    const pedido = await useCase.execute(req.params.id);
    if (!pedido)
      return res.status(404).json({ message: "Pedido no encontrado" });
    res.json(pedido);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const PostPedido = async (req, res) => {
  try {
    console.log("Request body (Pedido):", req.body);
    const pedidoData = req.body;

    if (!pedidoData || Object.keys(pedidoData).length === 0) {
      return res
        .status(400)
        .json({ error: "El cuerpo de la petición está vacío" });
    }

    const newPedido = await CrearPedido(
      pedidoRepository,
      productoRepository,
      pedidoData
    );

    res.status(201).json(newPedido);
  } catch (error) {
    console.error("Error en PostPedido:", error);
    res.status(500).json({ error: error.message });
  }
};

export const PutPedido = async (req, res) => {
  try {
    const { estado } = req.body;

    if (estado === "cancelado") {
      // Caso especial: cancelar pedido y devolver stock
      const useCase = new CancelarPedido(
        pedidoRepository,
        productoRepository
      );
      const pedidoCancelado = await useCase.execute(req.params.id);
      return res.json(pedidoCancelado);
    }

    // Caso normal: actualizar pedido
    const useCase = new PutPedidoUseCase(pedidoRepository);
    const pedido = await useCase.execute(req.params.id, req.body);

    if (!pedido)
      return res.status(404).json({ message: "Pedido no encontrado" });

    res.json(pedido);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

