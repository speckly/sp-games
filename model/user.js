/* Author: Ritchie Yapp, Singapore Polytechnic
https://github.com/speckly
SP Games Backend assignement 1

Models for /user endpoint and database interaction
Date Created: 6 June 2023

TODO: Make sure to validate all input, length included, as they raise exceptions
during query
*/

var db = require('./databaseConfig.js')
var sha256 = require('js-sha256')

var user = {
    //1: GET /users/
    getUsers: function(callback){
        conn = db.getConnection()
        conn.connect(function (err) {
            if (err) { //database connection issue
                return callback(err, null);
            } else {
                var getAllQuery = 'SELECT * FROM user;'
                conn.query(getAllQuery, function(err, result){
                    conn.end()
                    if (err){
                        return callback(err, null)
                    } else {
                        return callback(null, result)
                    }
                })
            }
        })
    },
    //2: POST /users/ return sqlreturn.userid with 200 else 500
    newUser: function(data, callback) {
        conn = db.getConnection()
        conn.connect(function (err) {
            if (err) { //database connection issue
                return callback(err, null);
            } else {
                var postQuery = `INSERT INTO user (username, email, password, type, profile_pic_url) 
                VALUES (?, ?, ?, ?, ?);`
                conn.query(postQuery, 
                    [data.username, data.email, sha256(data.password), data.type, data.profile_pic_url],
                    function(err, result){
                        conn.end()
                        if (err){
                            return callback(err, null)
                        } else {
                            return callback(null, {"userid": result.insertId})
                        }
                })
            }
        })
    },
    //3: GET /users/:id
    getUserbyID: function (userID, callback){
        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
            if (err) { //database connection issue
                return callback(err, null);
            } else {
                getQuery = `SELECT * FROM user WHERE userId = ?;`
                dbConn.query(getQuery, [userID] ,(err, result) => {
                    dbConn.end()
                    if (err){
                        console.log(err)
                        return callback(err, null)
                    }
                    return callback(null, result[0]) //only one user required
                })
            }})
    }
}

module.exports = user


