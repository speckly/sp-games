var mysql = require('mysql')
var dbconnect = {
    getConnection: function() {
        var conn = mysql.createConnection({
            host: "127.0.0.1",
            user: "root",
            password: "root",
            database: "sp_games",
            dateStrings: true
        });
        return conn;
    }
}

module.exports = dbconnect