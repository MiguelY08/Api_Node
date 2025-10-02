import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  idUsuario: { type: String, required: true, unique: true }, 
  nombre: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  rol: { type: String, enum: ["administrador", "cliente"], default: "cliente" } 
});

const UserModel = mongoose.model("User", UserSchema);

class UserRepositoryMongo {
  // Crear usuario
  async create(userData) {
    try {
      const user = new UserModel(userData);
      return await user.save();
    } catch (error) {
      if (error.code === 11000) {
        if (error.keyPattern?.email) {
          throw new Error("El email ya está registrado");
        }
        if (error.keyPattern?.idUsuario) {
          throw new Error("El idUsuario ya está registrado");
        }
      }
      throw error;
    }
  }

  // Buscar todos los usuarios
  async findAll() {
    return await UserModel.find();
  }

  // Buscar por email
  async findByUserEmail(email) {
    return await UserModel.findOne({ email });
  }

  // Buscar por idUsuario
  async findByIdUsuario(idUsuario) {
    return await UserModel.findOne({ idUsuario });
  }

  // Actualizar usuario por idUsuario
  async updateByIdUsuario(idUsuario, userData) {
    const updated = await UserModel.findOneAndUpdate(
      { idUsuario },
      userData,
      { new: true } // devuelve el objeto actualizado
    );
    if (!updated) {
      throw new Error("Usuario no encontrado");
    }
    return updated;
  }

  // Eliminar usuario por idUsuario
  async deleteByIdUsuario(idUsuario) {
    const deleted = await UserModel.findOneAndDelete({ idUsuario });
    if (!deleted) {
      throw new Error("Usuario no encontrado");
    }
    return deleted;
  }
}

export default UserRepositoryMongo;
