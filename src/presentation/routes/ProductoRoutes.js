import { Router } from "express";
import { 
  GetProducto, 
  GetProductoById, 
  PostProducto, 
  PutProducto, 
  DeleteProducto 
} from "../controllers/ProductoControllers.js";
import { authMiddleware } from "../middlewares/AuthMiddlewares.js";

const router = Router();

// Aplica authMiddleware a todas las rutas de este router
router.use(authMiddleware);

router.post("/" , authMiddleware, PostProducto);
router.get("/",authMiddleware, GetProducto);
router.get("/:id", authMiddleware, GetProductoById);
router.put("/:id", authMiddleware, PutProducto);
router.delete("/:id",authMiddleware, DeleteProducto);

export default router;
