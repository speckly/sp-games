/* Author: Ritchie Yapp, Singapore Polytechnic
https://github.com/speckly
SP Games Backend assignement 1

Models for /review endpoint and database interaction
Date Created: 6 June 2023

TODO: Make sure to validate all input, length included, as they raise exceptions
during query
*/

var db = require('./databaseConfig.js')

var review = {
    //10: POST 
    //data in this context refers to the content and rating
    newReview: function(uid, gid, data, callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
            if (err) {//database connection issue
                return callback(err, null);
            } else {
                newReviewQuery = `INSERT INTO reviews
                (userid, gameid, content, rating)
                VALUES (?, ?, ?, ?)`
                dbConn.query(newReviewQuery, [uid, gid, data.content, data.rating], (err, result) => {
                    dbConn.end()
                    if (err){
                        return callback(err, null)
                    }
                    return callback(null, {"reviewid": result.insertId})
                })
            }})
    },
    //11: GET /game/:id/review
    //id is game id (gid)
    getByID: function(gid, callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
            if (err) {//database connection issue
                return callback(err, null);
            } else {
                //TODO: modify query to replace returned userid with username
                getByIDQuery = `SELECT reviews.gameid, reviews.content, reviews.rating, user.username, user.userid, user.profile_pic_url, reviews.created_at 
                FROM reviews INNER JOIN user ON reviews.userid=user.userid
                WHERE reviews.gameid = ?`
                dbConn.query(getByIDQuery, gid, (err, result) => {
                    dbConn.end()
                    if (err){
                        return callback(err, null)
                    }
                    return callback(null, result)
                })
            }})
    }
};

module.exports = review;


