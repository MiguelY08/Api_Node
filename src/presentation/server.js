
import express from "express";
import usuarioRoutes from "./routes/UsuarioRoutes.js"
import loginRoutes from "./routes/LoginRoutes.js"
import productoRoutes from "./routes/ProductoRoutes.js"
import pedidoRoutes from "./routes/PedidoRoutes.js"
import cors from "cors";

const app = express();

app.use(cors({
  origin: "http://localhost:5173", // tu frontend
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

app.use("/api/auth/registrar", usuarioRoutes);
app.use("/api/auth/login", loginRoutes);
app.use("/api/productos", productoRoutes);
app.use("/api/pedidos", pedidoRoutes);

export default app;