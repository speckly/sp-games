/* Author: Ritchie Yapp, Singapore Polytechnic
https://github.com/speckly
SP Games Backend assignement 1

Models for /category endpoint and database interaction
Date Created: 6 June 2023

TODO: Make sure to validate all input, length included, as they raise exceptions
during query
*/

var db = require('./databaseConfig.js')

var category = {
    //4: POST /category
    newCategory: function(data, callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
            if (err) {//database connection issue
                return callback(err);
            } else {
                postQuery = `INSERT INTO categories
                (catname, description)
                VALUES (?, ?)`
                dbConn.query(postQuery, [data.catname, data.description], (err, result) => {
                    dbConn.end()
                    if (err){
                        return callback(err)
                    }
                    return callback(null)
                })
            }})
    },
    //Extra: GET /category
    getAllCategories: function (callback){
        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
            if (err) {//database connection issue
                return callback(err, null);
            } else {
                getQuery = `SELECT * FROM categories`
                dbConn.query(getQuery, (err, result) => {
                    dbConn.end()
                    if (err){
                        return callback(err, null)
                    }
                    return callback(null, result)
                })
            }})
    },
};

module.exports = category;


