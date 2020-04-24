

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    usuario: {
        type : Schema.Types.ObjectId,
        ref : 'Usuario'
    },
    descripcion: {
        type : String,
        unique: true,   
        required : [true, 'La descripcion es requerida']
    }
  });
  module.exports = mongoose.model('Categoria',usuarioSchema);