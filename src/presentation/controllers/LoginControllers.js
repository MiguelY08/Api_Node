import AutenticarUsuario from "../../Application/use_cases/usuario/AutenticarUsuario.js"
import UsuarioRepository from "../../infrastructure/repositories/UsuarioRepositoryMongo.js"
import PasswordEncrypter from "../security/password_encrypter.js"
import TokenGenerator from "../security/token_generator.js"
import usuarioModel from "../../Domain/models/Usuario.js"

const tokenGenerator = new TokenGenerator(process.env.JWT_SECRET || "claveNodeNueva")
const passwordEncrypter = new PasswordEncrypter()
const usuarioRepository = new UsuarioRepository(usuarioModel)

const loginUsuario = new AutenticarUsuario(usuarioRepository, passwordEncrypter, tokenGenerator)

export default class loginController {
  static async login(req, res) {
    try {
      const {token, Usuario}= await loginUsuario.execute(req.body);
      res.json({token, Usuario});
    } catch (err) {
      res.status(401).json({ error: err.message });
    }
  }
}