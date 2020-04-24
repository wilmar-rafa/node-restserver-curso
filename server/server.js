
require('./config/config');


const express = require('express');
const mongoose = require('mongoose');
const path     = require('path');
const app = express();
const bodyParser= require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());

// habilitar la carpeta public
app.use( express.static(path.resolve(__dirname , '../public')));

console.log(__dirname , '../public');
console.log(path.resolve(__dirname , '../public'));
 
////configuracion global de rutas
app.use(require('./routes/index.js'));

// mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true, useUnifiedTopology: true});

    /*{
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
    }*/
//mongodb://wilmarrafa:holaMundo1@cluster0-shard-00-00-fzxp9.mongodb.net:27017,cluster0-shard-00-01-fzxp9.mongodb.net:27017,cluster0-shard-00-02-fzxp9.mongodb.net:27017/test?replicaSet=Cluster0-shard-0&ssl=true&authSource=admin
//mongodb+srv://wilmarrafa:<password>@cluster0-fzxp9.mongodb.net/test
//mongodb+srv://strider:<password>@cluster0-em3uv.mongodb.net/cafe?retryWrites=true&w=majority
//mongodb+srv://wilmarrafa:holaMundo1@cluster0-fzxp9.mongodb.net/cafe 
//holaMundo1   
//mongoose.connect('mongodb://localhost:27017/cafe',{
mongoose.connect(process.env.URLDB,{
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
},(err,res)=>{
    if (err) throw 'Error Capturado:'+err;

    console.log('Conexion BD online');
});

 
app.listen(process.env.PORT, ()=>{
    console.log("Escuchando puerto ",process.env.PORT);
})