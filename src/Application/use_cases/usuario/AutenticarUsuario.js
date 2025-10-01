export default class Login {
  constructor(usuarioRepository, passwordEncrypter, tokenGenerator) {
    this.usuarioRepository = usuarioRepository
    this.passwordEncrypter = passwordEncrypter;
    this.tokenGenerator = tokenGenerator;
  }

  async execute({ email, password }) {
    const user = await this.usuarioRepository.findByUserEmail(email);
    if (!user) throw new Error("Usuario no encontrado");

    const isValid = await this.passwordEncrypter.comparePassword(password, user.password);
    if (!isValid) throw new Error("Contraseña incorrecta");

    const token = this.tokenGenerator.generate({ id: user.id, email: user.email });

    // Excluir password y devolver limpio
    const { password: _, __v, ...userData } = user.toObject();

    return { token, user: userData };
  }
}