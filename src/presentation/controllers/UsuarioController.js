import CrearUsuario from "../../Application/use_cases/usuario/RegistrarUsuario.js";
import GetUsuario from "../../Application/use_cases/usuario/GetUsuario.js";
import UsuarioRepositoryMongo from "../../infrastructure/repositories/UsuarioRepositoryMongo.js";
import PasswordEncrypter from "../security/password_encrypter.js";

const userRepository = new UsuarioRepositoryMongo()
const passwordEncrypter = new PasswordEncrypter()

export const createUser = async (req, res) => {
  try {
    const createUser = new CrearUsuario(userRepository, passwordEncrypter)
    const user = await createUser.execute(req.body)
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const getUsuarios = async (req, res) => {
  try {
    const getUsers = new GetUsuario(userRepository)
    const users = await getUsers.execute()
    res.status(200).json(users)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}