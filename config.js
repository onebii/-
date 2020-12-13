require('dotenv').config();


var DBConfigLocal = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    databse: process.env.DATABASE
}


module.exports = DBConfigLocal;