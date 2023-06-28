/* Author: Ritchie Yapp, Singapore Polytechnic
https://github.com/speckly
SP Games Backend assignement 1

Models for /platform endpoint and database interaction
Date Created: 6 June 2023

TODO: Make sure to validate all input, length included, as they raise exceptions
during query
*/

var db = require('./databaseConfig.js')

var platform = {
    newPlatform: function(data, callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
            if (err) {//database connection issue
                return callback(err);
            } else {
                postQuery = `INSERT INTO platforms
                (platform_name, description)
                VALUES (?, ?)`
                dbConn.query(postQuery, [data.platform_name, data.description], (err, result) => {
                    dbConn.end()
                    if (err){
                        return callback(err)
                    }
                    return callback(null)
                })
            }})
    }
};

module.exports = platform;


