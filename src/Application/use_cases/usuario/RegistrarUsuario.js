import Usuario from "../../../Domain/models/Usuario.js";

export default class CrearUsuario {
    constructor(userRepository, passwordEncrypter) {
      this.userRepository = userRepository;
      this.passwordEncrypter = passwordEncrypter;
    }
  
    async execute(userData) {
      const { idUsuario,  nombre, email, password, rol } = userData;
      // encriptar la contraseña antes de guardar
      const hashedPassword = await this.passwordEncrypter.hashPassword(password);

      const usuarioGuardado = new Usuario({
      idUsuario,
      nombre,
      email,
      password: hashedPassword,
      rol
    });

      return await this.userRepository.create(usuarioGuardado);
    }
}  