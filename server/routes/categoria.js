const express = require('express');

const _ = require('underscore');

const Categoria = require('../models/categoria.js');

const {verificaToken,verificaAdmin_Rol} = require('../middlewares/autentication.js');


const app = express();



app.get('/categoria',verificaToken, function (req, res) {
    
    let desde = req.query.desde || 0;
    desde     = Number(desde);

    let limite= req.query.limite || 5;
    limite    = Number(limite);

    //let filter={estado:true};
    let filter={};
    
    //Usuario.find({google:true}).
    Categoria.find(filter,'usuario descripcion')
    .sort('descripcion')
    .skip(desde)
    .limit(limite)
    .populate('usuario','nombre email')
    .exec((err,categoria)=>{

        if (err){
            return res.status(400).json({
                ok:         false,
                err
            })
        }

        Categoria.countDocuments(filter,(err,conteo)=>{

            res.json({
                ok : true,
                categoria,
                cuantos: conteo
            });

        });

        
    });

  });

  app.get('/categoria/:id',verificaToken, function (req, res) {
        let id = req.params.id;
        console.log('id',id);
        Categoria.findById(id,(err,categoriaBD)=>{

            if (err){
                return res.status(400).json({
                    ok:         false,
                    err
                })
            }

            res.json({
                ok : true,
                categoria:categoriaBD,
                cuantos: 1
            });

        });
    });  
  
  app.post('/categoria',[verificaToken], function (req, res) {
        let body = req.body;
        console.log('usuario:',req.usuario);

        let categoria = new Categoria({
            usuario:        req.usuario._id,
            descripcion:    body.descripcion
        });

        categoria.save((err,categoriaBD)=>{

            if (err){
                return res.status(400).json({
                    ok:         false,
                    err
                })
            }

            res.json({
                ok : true,
                categoria: categoriaBD
            });
        });
    
    });
  
    app.put('/categoria/:id',[verificaToken], function (req, res) {
        let id = req.params.id;
        let body = _.pick(req.body,['descripcion']);
        //let body = req.body;
       
        //options
        //new=>define si devuelve el nuevo objeto actualizado
        //runValidators=> para que haga todas las validaciones del modelo

        Categoria.findByIdAndUpdate(id,body,{new:true,runValidators:true},(err,categoriaBD)=>{

            if (err){
                return res.status(400).json({
                    ok:         false,
                    err
                })
            }

            res.json({
                ok:true,
                categoria:categoriaBD           
            });

        });

      
    });
  
    app.delete('/categoria/:id',[verificaToken,verificaAdmin_Rol], function (req, res) {
      //res.json('delete Usuario');
      let id = req.params.id;
      
      Categoria.findByIdAndDelete(id,(err,categoriaBorrado)=>{
      //  Usuario.findByIdAndUpdate(id,{estado:false},{new:true},(err,usuarioBorrado)=>{

        if (err){
            return res.status(400).json({
                ok:         false,
                err
            })
        }

        if (categoriaBorrado==null){
            return res.status(400).json({
                ok:         false,
                err:{
                    message: 'Categoria no encontrada'
                }
            })
        }

        res.json({
            ok:true,
            categoria:categoriaBorrado
        });

    });

    });


    module.exports=app;