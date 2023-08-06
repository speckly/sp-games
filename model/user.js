/* Author: Ritchie Yapp, Singapore Polytechnic
https://github.com/speckly
SP Games Backend assignement 1

Models for /user endpoint and database interaction
Date Created: 6 June 2023

TODO: Make sure to validate all input, length included, as they raise exceptions
during query
*/

var db = require('./databaseConfig.js')

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
                    [data.username, data.email, data.password, data.type, data.profile_pic_url],
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
    //3: GET /users/:id (Legacy)
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
                        return callback(err, null)
                    }
                    return callback(null, result[0]) //only one user required
                })
            }})
    },
    //Assignment 2 Endpoint, similar to Endpoint 3
    // POST /users/auth
    authUser: function (data, callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
            if (err) { //database connection issue
                return callback(err, null);
            } else {
                getQuery = `SELECT * FROM user WHERE email = ? and password = ?;`
                dbConn.query(getQuery, [data.email, data.password] ,(err, result) => {
                    dbConn.end()
                    if (err){
                        return callback(err, null)
                    }
                    return callback(null, result[0]) //only one user required
                })
            }})
    },
    verifyToken: function (req,res,next){
        var token=req.headers['authorization']; //retrieve authorization header’s content
        if(!token || !token.includes('Bearer')){ //process the token
            res.status(403);
            return res.send({auth:'false',message:'Not authorized!'});
        } else{
            token=token.split('Bearer ')[1]; //obtain the token’s value
            console.log(token);
            jwt.verify(token,config.key,function(err,decoded){//verify token
                if (err){
                    res.status(403);
                    return res.end({auth:false,message:'Not authorized!'});
                } else {
                    req.userid=decoded.userid; //decode the userid and store in req for use
                    req.role=decoded.role; //decode the role and store in req for use
                    next();
                }
            });
        }
    },
    uploadProfilePic: (src, uid, callback) => {
        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
            if (err) {//database connection issue
                return callback(err);
            } else {
                insertPfQuery = `UPDATE user 
                SET profile_pic_url = ?
                WHERE userid = ?;`
                dbConn.query(insertPfQuery, [src, uid], (err) => {
                    if (err) {
                        return callback(err)
                    } else {
                        return callback(null)
                    }
                })
            }})
    }
}

module.exports = user


