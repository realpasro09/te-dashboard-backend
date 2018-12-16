const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PerfilesSchema = new Schema({
  nombre: {
    required: true,
    type: String
  },
  categorias: [{ nombre: String, seleccionado: Boolean }],
  busquedas: [String],
  inactivo: Boolean
});

module.exports = mongoose.model("perfiles", PerfilesSchema);
