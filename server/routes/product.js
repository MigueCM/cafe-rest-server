const Product = require('../models/product');

const express = require('express');

const { verificaToken , verificaAdminRol } = require('../middlewares/authentication');

const app = express();

// ================================
// Mostrar todos los productos
// ================================

app.get('/product', verificaToken, (req,res)=>{

    Product.find({available: true})
            .populate('user','name email')
            .populate('category','description')
            .exec( (err, productDB)=>{
                
                if( err ){
                    return res.status(500)
                        .json({
                            ok: false,
                            err
                        })
                }

                res.json({
                    ok: true,
                    product: productDB
                });

            } );

});

// ================================
// Mostrar un producto por ID
// ================================

app.get('/product/:id', verificaToken, (req,res)=>{
    
    let id = req.params.id;

    Product.findById(id)
    .populate('user','name email')
    .populate('category','description')
    .exec(
        (err , productDB) => {
            if( err ){
                return res.status(500)
                    .json({
                        ok: false,
                        err
                    })
            }

            if( !productDB ){
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
                product: productDB
            });
        })

});

// ================================
// Buscar  productos
// ================================

app.get('/product/buscar/:termino', verificaToken, (req,res)=>{

    let termino = req.params.termino;

    let regex = new RegExp(termino,'i');

    Product.find({available: true , name: regex})
            .populate('category','description')
            .exec( (err, productDB)=>{
                
                if( err ){
                    return res.status(500)
                        .json({
                            ok: false,
                            err
                        })
                }

                res.json({
                    ok: true,
                    product: productDB
                });

            } );

});


// ================================
// Crear nueva producto
// ================================

app.post('/product', verificaToken, (req, res) =>{

    let body = req.body;

    let product = new Product({
        name: body.name,
        priceUnit: body.priceUnit,
        description: body.description,
        available: body.available,
        category: body.category,
        user: req.user._id
    });

    product.save( (err, productDB) => {

        if( err ){
            return res.status(500)
                .json({
                    ok: false,
                    err
                })
        }

        if( !productDB ){
            return res.status(400)
                .json({
                    ok: false,
                    err
                })
        }

        res.json({
            ok: true,
            product: productDB
        })

    });


});

// ================================
// Actualizar producto
// ================================

app.put('/product/:id', verificaToken, (req, res) =>{
    
    let id = req.params.id;
    let body = req.body;

    Product.findById(id,
        (err , productDB)=>{
            if( err ){
                return res.status(500)
                    .json({
                        ok: false,
                        err
                    })
            }
    
            if( !productDB ){
                return res.status(400)
                    .json({
                        ok: false,
                        err:{
                            message:'El producto no existe'
                        }
                    })
            }

            productDB.name = body.name;
            productDB.priceUnit = body.priceUnit;
            productDB.description = body.description;
            productDB.available = body.available;
            productDB.category = body.category;

            productDB.save( (err, productEdit) =>{

                if( err ){
                    return res.status(500)
                        .json({
                            ok: false,
                            err
                        })
                }

                res.json({
                    ok:true,
                    product: productEdit
                });

            } );

        })

});


// ================================
// Borrar producto
// ================================

app.delete('/product/:id', [verificaToken , verificaAdminRol], (req, res) =>{

    let id = req.params.id;

    Product.findById(
        id,
        (err , productDB) => {

            if( err ){
                return res.status(500)
                    .json({
                        ok: false,
                        err
                    })
            }

            if( !productDB ){
                return res.status(400)
                    .json({
                        ok: false,
                        err: {
                            message: 'El id no existe'
                        }
                    })
            }

            productDB.available = false;

            productDB.save( (err , productDelete) =>{

                if( err ){
                    return res.status(500)
                        .json({
                            ok: false,
                            err
                        })
                }

                res.json({
                    ok: true,
                    message: 'Producto Borrado'
                })

            } );
    
            
        }
    )


});


module.exports = app;

