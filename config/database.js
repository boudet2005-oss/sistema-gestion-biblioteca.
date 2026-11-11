const mongoose = require("mongoose");

async function connectDB() {
  if (!process.env.MONGODB_URI) {
    throw new Error("Falta MONGODB_URI. Configura la conexión en el archivo .env.");
  }

  mongoose.set("strictQuery", true);
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Conectado correctamente a MongoDB.");
}

module.exports = connectDB;
