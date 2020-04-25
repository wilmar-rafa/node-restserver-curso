const jwt = require('jsonwebtoken');

let verificaToken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: 'token no valido'
            });
        }

        console.log('decoded:', decoded);
        req.usuario = decoded.data;
        next();

    })
};

let verificaAdmin_Rol = (req, res, next) => {

    let usuario = req.usuario;

    let Rol = usuario.rol;

    if (Rol === 'ADMIN_ROL') {
        next();
    } else {
        return res.status(401).json({
            ok: false,
            err: 'El usuario no es aministrador'
        });
    }

};

let verificaTokenImg = (req, res, next) => {

    let token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: 'token img no valido:' + token
            });
        }

        console.log('decoded:', decoded);
        req.usuario = decoded.data;
        next();

    })
};


module.exports = { verificaToken, verificaAdmin_Rol, verificaTokenImg };