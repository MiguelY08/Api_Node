import UsuarioRepositoryMongo from "../../infrastructure/repositories/UsuarioRepositoryMongo.js";

const userRepository = new UsuarioRepositoryMongo();

export async function validarEmail(req, res, next) {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: "El email es obligatorio" });
    }

    if (email !== email.toLowerCase()) {
        return res.status(400).json({ error: "El email debe estar en minúsculas" });
    }

    if (email.length < 15) {
        return res.status(400).json({ error: "El email debe tener al menos 15 caracteres" });
    }

    if (!email.includes("@")) {
        return res.status(400).json({ error: "El email debe contener '@'" });
    }

    const regex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    if (!regex.test(email)) {
        return res.status(400).json({ error: "El email no tiene un formato válido" });
    }

    try {
        const existeEmail = await userRepository.findByUserEmail(email);
        if (existeEmail) {
            return res.status(400).json({ error: "El email ya está registrado" });
        }
        next();
    } catch (error) {
        return res.status(500).json({ error: "Error al validar el email en la base de datos" });
    }
}