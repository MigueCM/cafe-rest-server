require('./config/config');

const bodyParser = require('body-parser');
const express = require('express');
// Using Node.js `require()`
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

//habilitar la carpeta public
app.use( express.static( path.resolve( __dirname ,'../public' ) ) );

//Configuración global de rutas
app.use(require('./routes/index'))
 

mongoose.connect(process.env.URLDB, 
    {useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,}, 
    (err, res) =>{
        if (err) throw err;
    
        console.log("Base de datos online")
    
});

 
app.listen(process.env.PORT , ()=>{
    console.log('Escuchando el puerto: ',process.env.PORT);
})