const express = require('express');

const _ = require('underscore');

const Producto = require('../models/producto.js');

const {verificaToken,verificaAdmin_Rol} = require('../middlewares/autentication.js');


const app = express();



app.get('/producto',verificaToken, function (req, res) {
    
    let desde = req.query.desde || 0;
    desde     = Number(desde);

    let limite= req.query.limite || 5;
    limite    = Number(limite);

    let filter={disponible:true};
    //let filter={};
    
    //Usuario.find({google:true}).
    Producto.find(filter,'nombre precioUni descripcion disponible categoria usuario')
    .sort('nombre')
    .skip(desde)
    .limit(limite)
    .populate('usuario','nombre email')
    .populate('categoria')
    .exec((err,producto)=>{

        if (err){
            return res.status(400).json({
                ok:         false,
                err
            })
        }

        Producto.countDocuments(filter,(err,conteo)=>{

            res.json({
                ok : true,
                producto,
                cuantos: conteo
            });

        });

        
    });

  });

  app.get('/producto/:id',verificaToken, function (req, res) {
        let id = req.params.id;
        console.log('id',id);
        Producto.findById(id)
            .populate('usuario','nombre email')
            .populate('categoria')
            .exec((err,productoBD)=>{
            
            
           // ,(err,productoBD)=>{

            if (err){
                return res.status(400).json({
                    ok:         false,
                    err
                })
            }

            res.json({
                ok : true,
                producto:productoBD,
                cuantos: 1
            });

        });
    }); 

    app.get('/producto/buscar/:termino',verificaToken, function (req, res) {
    
        let termino= req.params.termino;
        
        let regExp = RegExp(termino,'i');

        let filter={disponible:true,nombre:regExp};
        //let filter={};
        
        //Usuario.find({google:true}).
        Producto.find(filter,'nombre precioUni descripcion disponible categoria usuario')
        .sort('nombre')
        .populate('usuario','nombre email')
        .populate('categoria')
        .exec((err,producto)=>{
    
            if (err){
                return res.status(400).json({
                    ok:         false,
                    err
                })
            }
    
            Producto.countDocuments(filter,(err,conteo)=>{
    
                res.json({
                    ok : true,
                    producto,
                    cuantos: conteo
                });
    
            });
    
            
        });
    
      });

  
  app.post('/producto',[verificaToken], function (req, res) {
        let body = req.body;
        console.log('usuario:',req.usuario);

        let producto = new Producto({
            nombre:         body.nombre,
            precioUni:      body.precioUni,
            descripcion:    body.descripcion,
            disponible:     body.disponible,
            
            categoria:      body.categoria,
            usuario:        req.usuario._id
        });

        producto.save((err,producoBD)=>{

            if (err){
                return res.status(400).json({
                    ok:         false,
                    err
                })
            }

            res.json({
                ok : true,
                producto: producoBD
            });
        });
    
    });
  
    app.put('/producto/:id',[verificaToken], function (req, res) {
        let id = req.params.id;
        //let body = _.pick(req.body,['descripcion']);
        let body = req.body;
       
        //options
        //new=>define si devuelve el nuevo objeto actualizado
        //runValidators=> para que haga todas las validaciones del modelo

        Producto.findByIdAndUpdate(id,body,{new:true,runValidators:true},(err,productoBD)=>{

            if (err){
                return res.status(500).json({
                    ok:         false,
                    err
                })
            }

            if (!productoBD){
                return res.status(400).json({
                    ok:         false,
                    err:{
                        message:'NO existe el producto'
                    }
                })
            }

            res.json({
                ok:true,
                producto:productoBD           
            });

        });

      
    });
  
    app.delete('/producto/:id',[verificaToken,verificaAdmin_Rol], function (req, res) {
      //res.json('delete Usuario');
      let id = req.params.id;
      
      //Categoria.findByIdAndDelete(id,(err,categoriaBorrado)=>{
      Producto.findByIdAndUpdate(id,{disponible:false},{new:true},(err,productoBorrado)=>{

        if (err){
            return res.status(400).json({
                ok:         false,
                err
            })
        }

        if (productoBorrado==null){
            return res.status(400).json({
                ok:         false,
                err:{
                    message: 'Producto no encontrada'
                }
            })
        }

        res.json({
            ok:true,
            producto:productoBorrado,
            message:'Producto borrado'
        });

    });

    });


    module.exports=app;