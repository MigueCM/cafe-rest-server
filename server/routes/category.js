const Category = require('../models/category');

const express = require('express');

const { verificaToken, verificaAdminRol } = require('../middlewares/authentication');

const app = express();

// ================================
// Mostrar todas las categorías
// ================================

app.get('/category', verificaToken, (req, res) =>{

    Category.find({})
            .sort('description')
            .populate('user','name email')
            .exec( (err , categoryDB) =>{
                if( err ){
                    return res.status(500)
                        .json({
                            ok: false,
                            err
                        })
                }
        
                res.json({
                    ok: true,
                    category: categoryDB
                });
            } );

});

// ================================
// Mostrar una categoría por id
// ================================

app.get('/category/:id', verificaToken, (req, res) =>{
    
    let id = req.params.id;
    Category.findById(id,
            (err , categoryDB) => {
                if( err ){
                    return res.status(500)
                        .json({
                            ok: false,
                            err
                        })
                }

                if( !categoryDB ){
                    return res.status(400)
                        .json({
                            ok: false,
                            err:{
                                message: 'El ID no es correcto'
                            }
                        })
                }
        
                res.json({
                    ok: true,
                    category: categoryDB
                });
            })

});


// ================================
// Crear nueva categoría
// ================================

app.post('/category', verificaToken, (req, res) =>{

    let body = req.body;

    let category = new Category({
        description: body.description,
        user: req.user._id
    });

    category.save( (err, categoryDB) => {

        if( err ){
            return res.status(500)
                .json({
                    ok: false,
                    err
                })
        }

        if( !categoryDB ){
            return res.status(400)
                .json({
                    ok: false,
                    err
                })
        }

        res.json({
            ok: true,
            category: categoryDB
        })

    });

});

// ================================
// Actualizar categoría
// ================================

app.put('/category/:id', verificaToken, (req, res) =>{

    let id = req.params.id;
    let body = req.body;

    let desCategoria = {
        description: body.description
    }

    Category.findByIdAndUpdate(id,
        desCategoria,
        {
            new : true,
            runValidators: true
        },
        (err,categoryDB) => {
        
            if( err ){
                return res.status(500)
                    .json({
                        ok: false,
                        err
                    })
            }
            
            if( !categoryDB ){
                return res.status(400)
                    .json({
                        ok: false,
                        err
                    })
            }
    
            res.json({
                ok: true,
                category: categoryDB
            })
        });
    

});

// ================================
// Borrar categoría
// ================================

app.delete('/category/:id', [verificaToken , verificaAdminRol], (req, res) =>{

    let id = req.params.id;

    Category.findByIdAndRemove(
        id,
        (err , categoryDB) => {

            if( err ){
                return res.status(500)
                    .json({
                        ok: false,
                        err
                    })
            }

            if( !categoryDB ){
                return res.status(400)
                    .json({
                        ok: false,
                        err: {
                            message: 'El id no existe'
                        }
                    })
            }
    
            res.json({
                ok: true,
                message: 'Categoria Borrada'
            })
        }
    )


});

module.exports = app;