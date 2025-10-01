
import express from "express";
import usuarioRoutes from "../presentation/routes/UsuarioRoutes.js"
import loginRoutes from "../presentation/routes/loginRoutes.js"
import productoRoutes from "../presentation/routes/ProductoRoutes.js"
import pedidoRoutes from "../presentation/routes/PedidoRoutes.js"
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