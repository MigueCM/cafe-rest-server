

// ====================
// Puerto
// ====================

process.env.PORT = process.env.PORT || 3000;

// ====================
// Entorno
// ====================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ====================
// Base de datos
// ====================

let urlDB;

if(process.env.NODE_ENV  === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe2';
}else{
    urlDB = 'mongodb+srv://admin:CsxGfd37HUrOXIOj@cluster0.v9ncq.mongodb.net/cafe';
}

process.env.URLDB = urlDB;