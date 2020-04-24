
//////Puerto
process.env.PORT= process.env.PORT || 3000;

//////Entorno
process.env.NODE_ENV= process.env.NODE_ENV || 'dev';


/////caducidad de token
//60 segundos
//60 minutos
//24 horas
//30 dias
process.env.CADUCIDAD_TOKEN= 1000 * 60 * 60 *24 * 30;

//SEED de autenticacion
process.env.SEED= process.env.SEED || 'este-es-el-seed-de-desarrollo';

////// Base de Datos
let urlDB;

if (process.env.NODE_ENV === 'dev'){
    urlDB='mongodb://localhost:27017/cafe';
}else{
    urlDB=process.env.MONGO_URI;
}

process.env.URLDB=urlDB


/////Client ID Google
process.env.CLIENT_ID= process.env.CLIENT_ID || '598662386006-loppaf4lj9b0n8okvdf3s84a036fooq7.apps.googleusercontent.com';

