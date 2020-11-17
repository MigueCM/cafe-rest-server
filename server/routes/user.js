const User = require('../models/user');

const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const app = express();

app.get('/user', function (req, res) {
    
    let from = req.query.from || 0;
    from = Number(from);

    let limit = req.query.limit || 5;
    limit = Number(limit);

    User.find({state: true}, 
        'name email role state')
        .skip(from)
        .limit(limit)
        .exec( (err , userDB) =>{
            if( err ){
                return res.status(400)
                    .json({
                        ok: false,
                        err
                    })
            }

            User.countDocuments({state: true},
                ( err, cont ) =>{

                res.json({
                    ok: true,
                    user: userDB,
                    lenght: cont
                });

            });

            // res.json({
            //     ok: true,
            //     user: userDB
            // });

        } );

})
  
app.post('/user', function (req, res) {
    let body = req.body;

    let user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    user.save( (err,userDB) => {

        if( err ){
            return res.status(400)
                .json({
                    ok: false,
                    err
                })
        }

        //userDB.password = null;
        
        res.json({
            ok: true,
            user: userDB
        })

    } );

})
  
app.put('/user/:id', function (req, res) {

    let id = req.params.id;
    let body = _.pick(req.body,[
        'name',
        'email',
        'img',
        'role',
        'state'
    ]);

    User.findByIdAndUpdate( id, 
                            body , 
                            {
                                new : true,
                                runValidators: true
                            },
                            (err,userDB) => {
        
        if( err ){
            return res.status(400)
                .json({
                    ok: false,
                    err
                })
        }
        
        res.json({
            ok: true,
            user: userDB
        })
    });

    
})

app.delete('/user/:id', function (req, res) {

    let id = req.params.id;


    // Eliminacion física
    // User.findByIdAndRemove(id, (err, userDB) => {

    //     if( err ){
    //         return res.status(400)
    //             .json({
    //                 ok: false,
    //                 err
    //             })
    //     }

    //     if( !userDB){
    //         return res.status(400)
    //             .json({
    //                 ok: false,
    //                 err: {
    //                     message: 'Usuario no encontrado'
    //                 }
    //             })
    //     }

    //     res.json({
    //         ok: true,
    //         user: userDB
    //     })

    // });

    // Eliminación lógica

    let changeState = {
        state : false
    }

    User.findByIdAndUpdate(id, changeState, {new: true},(err, userDB) => {

        if( err ){
            return res.status(400)
                .json({
                    ok: false,
                    err
                })
        }

        if( !userDB){
            return res.status(400)
                .json({
                    ok: false,
                    err: {
                        message: 'Usuario no encontrado'
                    }
                })
        }

        res.json({
            ok: true,
            user: userDB
        })

    });
})

module.exports = app;
