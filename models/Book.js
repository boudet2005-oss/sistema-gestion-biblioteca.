const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "El título es obligatorio."],
    trim: true,
    maxlength: 160
  },
  author: {
    type: String,
    required: [true, "El autor es obligatorio."],
    trim: true,
    maxlength: 120
  },
  category: {
    type: String,
    required: [true, "La categoría es obligatoria."],
    trim: true,
    maxlength: 80
  },
  year: {
    type: Number,
    min: [0, "El año no puede ser negativo."],
    max: [new Date().getFullYear() + 1, "El año no puede ser futuro."]
  },
  isbn: { type: String, trim: true, maxlength: 30 },
  description: { type: String, trim: true, maxlength: 2000 },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, { timestamps: true });

bookSchema.index({ title: "text", author: "text", category: "text" });

module.exports = mongoose.model("Book", bookSchema);
