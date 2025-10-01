import mongoose from "mongoose";
import { Pedido } from "../../Domain/models/Pedido.js";

// ============================
// SCHEMAS
// ============================
const pedidoDetalleSchema = new mongoose.Schema({
  idProducto: { type: String, required: true },
  cantidad: { type: Number, required: true },
  precioUnitario: { type: Number, required: true },
  subtotal: { type: Number }
});

// Hook para calcular subtotal antes de guardar cada detalle
pedidoDetalleSchema.pre("save", function (next) {
  this.subtotal = this.cantidad * this.precioUnitario;
  next();
});

const pedidoSchema = new mongoose.Schema({
  idPedido: { type: String, required: true, unique: true },
  idUsuario: { type: String, required: true },
  estado: { type: String, enum: ["activo", "cancelado"], default: "activo" },
  detalles: [pedidoDetalleSchema],
  total: { type: Number },
  createdAt: { type: Date, default: Date.now }
});

// === Hook para calcular total del pedido antes de guardar ===
pedidoSchema.pre("save", function (next) {
  if (this.detalles && this.detalles.length > 0) {
    this.total = this.detalles.reduce((acc, d) => acc + d.subtotal, 0);
  } else {
    this.total = 0;
  }
  next();
});

const PedidoModel = mongoose.model("Pedido", pedidoSchema);

export default class PedidoRepositoryMongo {
  // Convierte un documento de Mongo a objeto de dominio
  toDomain(pedidoDoc) {
    if (!pedidoDoc) return null;
    return new Pedido({
      idPedido: pedidoDoc.idPedido,
      idUsuario: pedidoDoc.idUsuario,
      estado: pedidoDoc.estado,
      total: pedidoDoc.total,
      createdAt: pedidoDoc.createdAt,
      detalles: pedidoDoc.detalles
    });
  }

  // CREATE
  async create(data) {
    const pedidoDoc = await PedidoModel.create(data);
    return this.toDomain(pedidoDoc);
  }

  // GET BY CUSTOM ID
  async getByIdPedido(idPedido) {
    const pedidoDoc = await PedidoModel.findOne({ idPedido });
    return this.toDomain(pedidoDoc);
  }

  // GET ALL
  async getAll() {
    const pedidosDoc = await PedidoModel.find();
    return pedidosDoc.map((p) => this.toDomain(p));
  }

  // UPDATE BY CUSTOM ID
  async updateByIdPedido(idPedido, data) {
    const pedidoDoc = await PedidoModel.findOneAndUpdate({ idPedido }, data, { new: true });
    return this.toDomain(pedidoDoc);
  }

  // DELETE BY CUSTOM ID
  async deleteByIdPedido(idPedido) {
    const pedidoDoc = await PedidoModel.findOneAndDelete({ idPedido });
    return this.toDomain(pedidoDoc);
  }
}
