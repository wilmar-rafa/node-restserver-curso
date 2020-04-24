
const express = require('express');

const bcrypt = require('bcrypt');

const jwt   = require('jsonwebtoken');

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID= process.env.CLIENT_ID );

const Usuario = require('../models/usuario.js');

const app = express();


app.post('/login',(req,res)=>{

    let body=req.body;
    Usuario.findOne({email:body.email},(err,usuarioBD)=>{

        if (err){
            return res.status(500).json({
                ok:         false,
                err
            })
        }

        if (!usuarioBD){
            return res.status(400).json({
                ok:         false,
                err:{
                    message:'(Usuario) y contraseña invalidos'
                }
            })
        }

       if( !bcrypt.compareSync(body.password,usuarioBD.password) ){

        return res.status(400).json({
            ok:         false,
            err:{
                message:'Usuario y (contraseña) invalidos'
            }
        })

       }

       let token=jwt.sign({
         data: usuarioBD
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN});

       res.json({
           ok:  true,
           usuario: usuarioBD,
           token
       });


    });

})


//configuraciones de google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    
    console.log(payload.name);
    console.log(payload.email);
    console.log(payload.picture);

    return {
        name:   payload.name,
        email:  payload.email,
        img:    payload.picture,
        google: true
    }
    
  }
  

app.post('/google', async (req,res)=>{
    let body=req.body;

    let tokenGoogle=body.idtoken;
    let googleUser;
    try{
        googleUser = await verify(tokenGoogle)
    }    catch( e ){
            
            return res.status(403).json({
                ok:         false,
                err:'ERROR:'+e
            })

        };

    
    if (googleUser.email===undefined){
        return res.status(403).json({
            ok:         false,
            err:{
                message:'usuario no existe'
            }
        });
    }
    Usuario.findOne({email:googleUser.email},(err,usuarioBD)=>{

        if (err){
            return res.status(500).json({
                ok:         false,
                err
            })
        }

        if(usuarioBD){

            if (usuarioBD.google===false){
                return res.status(400).json({
                    ok:         false,
                    err:{
                        message:'Debe ingresar usuar la autenticacion normal'
                    }
                });
            }else{

                let token=jwt.sign({
                    data: usuarioBD
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN});
        
                return res.json({
                    ok:  true,
                    usuario: usuarioBD,
                    token
                });
            }

        }else{

            console.log('Usuario No existe en BD');
            let usuario = new Usuario({
                nombre: googleUser.name,
                email:   googleUser.email,
                password: 'xx',
                img:     googleUser.img,
                google:  true
            });
            console.log('nuevo usuario:',usuario);
    
            usuario.save((err,usuarioBD)=>{
    
                if (err){
                    return res.status(500).json({
                        ok:         false,
                        err:{
                            message:'Error al almacenar en BD'
                        }
                    })
                }

                let token=jwt.sign({
                    data: usuarioBD
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN});
        
    
                return res.json({
                    ok : true,
                    usuario: usuarioBD,
                    token
                });
            });
        }


    });
/*
    res.json({
        usuario:googleUser
    });*/
})


module.exports=app;