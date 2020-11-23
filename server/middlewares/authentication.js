const jwt = require('jsonwebtoken');

// ====================
// Verificar Token
// ====================

let verificaToken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify( token, process.env.SEED, (err, decode)=>{

        if( err ){
            return res.status(401)
                .json({
                    ok: false,
                    err: 'Token no válido'
                })
        }

        req.user = decode.user
        next();

    });

    

}

let verificaAdminRol = (req, res, next) =>{
    
    let user = req.user;

    if(user.role == "ADMIN_ROLE"){
        next();
    }else{
        return res.json({
                    ok: false,
                    err: {
                        message: 'El usuario no es administrador'
                    }
                })
    }


}

module.exports = {
    verificaToken,
    verificaAdminRol
}