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
  async create(userData) {
    try {
      const user = new UserModel(userData);
      return await user.save();
    } catch (error) {
      if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
        throw new Error("El email ya está registrado");
      }
      if (error.code === 11000 && error.keyPattern && error.keyPattern.idUsuario) {
        throw new Error("El idUsuario ya está registrado");
      }
      throw error;
    }
  }

  async findAll() {
    return await UserModel.find();
  }

  async findByUserEmail(email) {
    return await UserModel.findOne({ email });
  }
}

export default UserRepositoryMongo;
