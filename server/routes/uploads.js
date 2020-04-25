const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario.js');
const Producto = require('../models/producto.js');

const fs = require('fs');
const path = require('path');

//app.use(fileUpload());
app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No ha seleccionado ningun archivo'
            }
        });
    }

    // The name of the input field (i.e. "archivo") is used to retrieve the uploaded file
    let archivo = req.files.archivo;

    let archivoCortado = archivo.name.split('.');
    let extension = archivoCortado[archivoCortado.length - 1];

    let extensionnesValidas = ['png', 'jpg', 'gif', 'jpeg'];
    let tiposValidos = ['productos', 'usuarios'];

    if (extensionnesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son: ' + extensionnesValidas.join(', '),
                ext: extension
            }
        });
    }

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son: ' + tiposValidos.join(', '),
                ext: extension
            }
        });
    }

    let nombreArchivo = `${id}-${ new Date().getMilliseconds()}.${extension}`;
    // Use the mv() method to place the file somewhere on your server
    archivo.mv(`./uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });
        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo);
        } else {
            imagenProducto(id, res, nombreArchivo);
        }

    });
});

function imagenUsuario(id, res, nombreArchivo) {

    Usuario.findById(id, (err, usuarioBD) => {

        if (err) {
            borrarArchivo(nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if (!usuarioBD) {
            borrarArchivo(nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            })
        }

        /*let pathImagen = path.resolve(__dirname, `../../uploads/usuarios/${usuarioBD.img}`);
        console.log(pathImagen);
        if (fs.existsSync(pathImagen)) {
            console.log('si existe la imagen, se debe borrar');
            fs.unlinkSync(pathImagen);
        }*/

        borrarArchivo(usuarioBD.img, 'usuarios');

        usuarioBD.img = nombreArchivo;

        usuarioBD.save((err, usuarioGuardado) => {
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            });
        });

    });
}


function imagenProducto(id, res, nombreArchivo) {

    Producto.findById(id, (err, productoBD) => {

        if (err) {
            borrarArchivo(nombreArchivo, 'productos');
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if (!productoBD) {
            borrarArchivo(nombreArchivo, 'productos');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no existe'
                }
            })
        }



        borrarArchivo(productoBD.img, 'productos');

        productoBD.img = nombreArchivo;

        productoBD.save((err, productoGuardado) => {
            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            });
        });

    });
}

function borrarArchivo(nombreImagen, tipo) {

    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
    console.log(pathImagen);
    if (fs.existsSync(pathImagen)) {
        console.log('si existe la imagen, se debe borrar');
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;