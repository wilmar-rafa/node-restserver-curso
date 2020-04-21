

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

let rolesValidos={
    values : ['USER_ROL','ADMIN_ROL'],
    message: '{VALUE} no es un rol valido'
}

let usuarioSchema = new Schema({
    nombre: {
        type : String,
        required : [true, 'El nombre es requerido']
    },
    email: {
        type : String,
        unique: true,   
        required : [true, 'El email es requerido']
    },
    password: {
        type : String,
        required : [true, 'La contraseña es requerida']
    },
    img: {
        type : String
    },
    rol:{
        type : String,
        default : 'USER_ROL',
        enum :  rolesValidos
    },
    estado: {
        type : Boolean,
        default : true
    },
    google: {
        type: Boolean,
        default : false
    }
  });

  usuarioSchema.methods.toJSON= function (){
      let user=this;
      let userObject = user.toObject();
      delete userObject.password;

      return userObject;
  }

  usuarioSchema.plugin(uniqueValidator, {message:'{PATH} debe ser único'});

  module.exports = mongoose.model('Usuario',usuarioSchema);