

// ====================
// Puerto
// ====================

process.env.PORT = process.env.PORT || 3000;

// ====================
// Entorno
// ====================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ====================
// Vencimiento del token
// ====================

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

// ====================
// SEED de autenticación
// ====================

process.env.SEED = process.env.SEED || 'seed-secret-desarrollo';

// ====================
// GOOGLE Client ID
// ====================

process.env.CLIENT_ID = process.env.CLIENT_ID || '618362820884-f9nmmjdras00sqpjhu7a5jl90b2jbaes.apps.googleusercontent.com';

// ====================
// Base de datos
// ====================

let urlDB;

if(process.env.NODE_ENV  === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe2';
}else{
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;