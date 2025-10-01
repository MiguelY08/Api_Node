import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log("MONGO_URI:", process.env.MONGO_URI)
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log("Conectado a MongoDB")
  } catch (err) {
    console.error("Error de conexión:", err)
    process.exit(1)
  }
}

export default connectDB