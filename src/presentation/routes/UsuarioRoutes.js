import { Router } from "express";
import { createUser, getUsuarios } from "../controllers/UsuarioController.js";
import { validarEmail } from "../middlewares/EmailValidator.js";

const router = Router();

router.post("/", validarEmail, createUser);
router.get("/", getUsuarios);

export default router;