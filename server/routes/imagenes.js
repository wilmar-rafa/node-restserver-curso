const express = require('express');

const fs = require('fs');
const path = require('path');
const { verificaTokenImg } = require('../middlewares/autentication.js');


let app = express();

app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {

    let tipo = req.params.tipo;
    let img = req.params.img;

    //let pathImg = `./uploads/${tipo}/${img}`;

    let pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);


    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
    } else {
        let pathNoImage = path.resolve(__dirname, '../assets/noImagen.jpg');
        res.sendFile(pathNoImage);
    }

    // res.sendfile('./server/assets/noImagen.jpg');


});


module.exports = app;