import { Router } from "express";
import { GetPedido, GetPedidoById, PostPedido, PutPedido } from "../controllers/PedidoControllers.js"
import { authMiddleware } from "../middlewares/AuthMiddlewares.js";

// Creamos una nueva instancia del router.
const router = Router();

// Definimos la ruta POST para crear un nuevo pedido. Llama al controlador 'PostPedido'.
router.post("/",authMiddleware ,PostPedido);

// Definimos la ruta GET para obtener todos los pedidos. Llama al controlador 'GetPedido'.
router.get("/",authMiddleware, GetPedido);

// Definimos la ruta GET para obtener un pedido específico por su ID. Llama al controlador 'GetPedidoById'.
router.get("/:id", authMiddleware ,GetPedidoById);

// Definimos la ruta PUT para actualizar un pedido específico por su ID. Llama al controlador 'PutPedido'.
router.put("/:id", authMiddleware,PutPedido);





// Exportamos el router para que pueda ser usado en otras partes de la aplicación (por ejemplo, en el archivo principal de rutas).
export default router;