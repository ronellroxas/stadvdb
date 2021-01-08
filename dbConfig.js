const mysql = require('mysql');

//const connection = mysql.createConnection(process.env.CLEARDB_DATABASE_URL);

const connection = mysql.createPool(process.env.CLEARDB_DATABASE_URL);

module.exports = connection;