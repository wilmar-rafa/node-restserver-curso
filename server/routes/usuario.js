const express = require('express');

const bcrypt = require('bcrypt');

const _ = require('underscore');

const Usuario = require('../models/usuario.js');

const {verificaToken,verificaAdmin_Rol} = require('../middlewares/autentication.js');


const app = express();



app.get('/usuario',verificaToken, function (req, res) {
    //res.json('get Usuario')
/*
    return res.json({
        usuario:req.usuario,
        nombe:req.usuario.nombre,
        email: req.usuario.email
    });
*/
    let desde = req.query.desde || 0;
    desde     = Number(desde);

    let limite= req.query.limite || 5;
    limite    = Number(limite);

    let filter={estado:true};
    //let filter={};
    
    //Usuario.find({google:true}).
    Usuario.find(filter,'nombre email img rol estado google ').
    skip(desde)
    .limit(limite)
    .exec((err,usuario)=>{

        if (err){
            return res.status(400).json({
                ok:         false,
                err
            })
        }

        //Usuario.count({google:true},(err,conteo)=>{
        Usuario.countDocuments(filter,(err,conteo)=>{

            res.json({
                ok : true,
                usuario: usuario,
                cuantos: conteo
            });

        });

        
    });

  });
  
  app.post('/usuario',[verificaToken,verificaAdmin_Rol], function (req, res) {
        let body = req.body;

        let usuario = new Usuario({
            nombre: body.nombre,
            email:   body.email,
            password: bcrypt.hashSync(body.password,10),
            //img:     body.img,
            rol:     body.rol
            //estado:  body.estado,
            //google:  body.google
        });

        usuario.save((err,usuarioBD)=>{

            if (err){
                return res.status(400).json({
                    ok:         false,
                    err
                })
            }

            res.json({
                ok : true,
                usuario: usuarioBD
            });
        });
      
        /*
      if (body.nombre===undefined){
          res.status(400).json({
              ok:         false,
              mensaje:    'el nombre es necesario'
          });
      }else{
          res.json({
              persona:body
          })
      }*/
  
    });
  
    app.put('/usuario/:id',[verificaToken,verificaAdmin_Rol], function (req, res) {
        let id = req.params.id;
        let body = _.pick(req.body,['nombre','email','img','rol','estado']);
        //let body = req.body;
       
        //options
        //new=>define si devuelve el nuevo objeto actualizado
        //runValidators=> para que haga todas las validaciones del modelo

        Usuario.findByIdAndUpdate(id,body,{new:true,runValidators:true},(err,usuarioBD)=>{

            if (err){
                return res.status(400).json({
                    ok:         false,
                    err
                })
            }

            res.json({
                ok:true,
                usuario:usuarioBD
            });

        });

      
    });
  
    app.delete('/usuario/:id',[verificaToken,verificaAdmin_Rol], function (req, res) {
      //res.json('delete Usuario');
      let id = req.params.id;
      
      //Usuario.findByIdAndDelete(id,(err,usuarioBorrado)=>{
        Usuario.findByIdAndUpdate(id,{estado:false},{new:true},(err,usuarioBorrado)=>{

        if (err){
            return res.status(400).json({
                ok:         false,
                err
            })
        }

        if (usuarioBorrado==null){
            return res.status(400).json({
                ok:         false,
                err:{
                    message: 'Usuario no encontrado'
                }
            })
        }

        res.json({
            ok:true,
            usuario:usuarioBorrado
        });

    });

    });


    module.exports=app;