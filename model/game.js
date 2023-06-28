/* Author: Ritchie Yapp, Singapore Polytechnic
https://github.com/speckly
SP Games Backend assignement 1

Models for /game endpoint and database interaction
Date Created: 6 June 2023

TODO: Make sure to validate all input, length included, as they raise exceptions
during query
*/

var db = require('./databaseConfig.js');

var game = {
    //6: POST /game
    newGame: function(data, callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
            if (err) {//database connection issue
                return callback(err, null);
            } else {
                //Note platformid can contain multiple values
                //Note foriegn key contstraints platformid and categoryid raises exceptions if not found
                postQuery = `INSERT INTO games
                (title, description, categoryid, year, price)
                VALUES (?, ?, ?, ?, ?)`
                price = `\"${data.price}\"`
                dbConn.query(postQuery, 
                    [data.title, data.description, data.categoryid, data.year, price], 
                    (err, result) => {
                        if (err){
                            return callback(err, null)
                        } else {
                            createPlatformQuery = `CREATE TABLE game${result.insertId}platforms ( 
                                platformid int NOT NULL AUTO_INCREMENT,
                                KEY fk_platformid${result.insertId}_idx (platformid),
                                CONSTRAINT fk_platformid${result.insertId} FOREIGN KEY (platformid) REFERENCES platforms (platformid)
                            )`
                            dbConn.query(createPlatformQuery, (err) => {
                                if (err) { 
                                    return callback(err, null)
                                } else {
                                    insertPlatformQuery = `INSERT INTO game${result.insertId}platforms
                                    VALUES (?)`
                                    platforms = data.platformid.split(",")
                                    lastIndex = platforms.length - 1
                                    platforms.forEach(async (element, currentIndex) => {
                                        dbConn.query(insertPlatformQuery, element.trim(), (err) => {
                                            if (err) { 
                                                dbConn.end()
                                                return callback(err, null)
                                            } else {
                                                if (currentIndex == lastIndex){
                                                    dbConn.end()
                                                    return callback(null, {"gameid": result.insertId})
                                                }
                                            }
                                        })
                                    })
                                }
                            })
                        }
                        
                })
            }})
    },
    //7: GET /game/:platform
    getByPlatform: function(platform, callback){
        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
            if (err) {//database connection issue
                return callback(err, null);
            } else {
                //Note foriegn key contstraints platformid and categoryid raises exceptions if not found
                getIDsQuery = `SELECT gameid FROM games;`
                dbConn.query(getIDsQuery, (err, result) => {
                    if (err){
                        return callback(err, null)
                    } else {
                        respon = []
                        queryIDs = []
                        result.forEach((gameidObj) => {
                            findQuery = `SELECT * FROM game${gameidObj.gameid}platforms WHERE platformid = ?`
                            dbConn.query(findQuery, platform, (err, truth) => {
                                if (err){
                                    return callback(err, null)
                                } else {
                                    if (truth.length == 1){ //platform is present so query gameid and append
                                        queryIDs.push(gameidObj.gameid)
                                    }
                                    //return within the loop as outside the loop will return too early (foreach is async funct)
                                }
                            })
                        })
                        setTimeout(() => {
                            lastIndex = queryIDs.length - 1 
                            queryIDs.forEach((id, currentIndex) => {
                                getGamesQuery = `SELECT games.gameid, games.title, games.description, games.price, platforms.platform_name, games.categoryid AS catid, categories.catname, games.year FROM games, platforms, categories 
                                WHERE platforms.platformid = ? and games.gameid = ?;`
                                dbConn.query(getGamesQuery, [platform, id], async (err, result) => {
                                    if (err){
                                        return callback(err, null)
                                    } else {
                                        result = result[0] //strip square bracket
                                        result.price = `${result.price.slice(1,-1)}` //string notation per requirement
                                        respon.push(result) 
                                        if (currentIndex == lastIndex) {
                                            dbConn.end()
                                            return callback(null, respon)
                                        }
                                    }
                                })
                            })
                        }, 5*result.length) //can be improved
                        
                    }   
                })
            }})
    },
    //8: DELETE /game/:id
    deletebyID: function (id, callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
            if (err) {//database connection issue
                return callback(err);
            } else {
                //Note foriegn key contstraints platformid and categoryid raises exceptions if not found
                deleteGameQuery = `DELETE FROM games WHERE gameid = ?;` //Seems to work in workbench please test again
                dbConn.query(deleteGameQuery, [id], (err) => {
                    if (err){
                        return callback(err)
                    } else {
                        tableName = `game${id}platforms`
                        deleteGamePlatformsQuery = `DROP TABLE ??;` //?? placeholder for identifier
                        dbConn.query(deleteGamePlatformsQuery, tableName, (err) => {
                            dbConn.end()
                            if (err){
                                return callback(err)
                            } else {
                                return callback(null)
                            }
                            
                        })
                    }
                })
            }})
    },
    //9: PUT /game/:id
    updateGame: function(id, data, callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
            if (err) {//database connection issue
                return callback(err);
            } else {
                //Note foriegn key contstraints platformid and categoryid raises exceptions if not found
                updateGameQuery = `UPDATE games 
                SET title = ?, 
                description = ?, 
                categoryid = ?, 
                year = ?, 
                price = ?
                WHERE gameid = ?;`
                price = `\"${data.price}\"`
                dbConn.query(updateGameQuery, 
                    [data.title, data.description, data.categoryid, data.year, price, id], 
                    (err) => {
                        if (err){
                            return callback(err)
                        } else {
                            tableName = `game${id}platforms`
                            deleteGamePlatformQuery = `DELETE FROM ?? WHERE platformid > 0` //delete all
                            dbConn.query(deleteGamePlatformQuery, tableName, (err) => {
                                if (err){
                                    return callback(err)
                                } else {
                                    insertNewPlatformQuery = `INSERT INTO ?? VALUES (?)`
                                    platforms = data.platformid.split(",")
                                    lastIndex = platforms.length - 1
                                    platforms.forEach(async (element, currentIndex) => {
                                        dbConn.query(insertNewPlatformQuery, [tableName ,element.trim()], (err) => {
                                            if (err) { 
                                                dbConn.end()
                                                return callback(err)
                                            } else if (currentIndex == lastIndex){
                                                dbConn.end()
                                                return callback(null)
                                            }
                                        })
                                    })
                                }
                            })
                        }
                        
                })
            }})
    },
    //Bonus endpoint: PUT /game/:id/image
    //
    upload: function(gid, data, callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
            if (err) {//database connection issue
                return callback(err);
            } else {
                const imageQuery = 
                `UPDATE games
                SET
                    image = ?
                WHERE gameid = ?`
                dbConn.query(imageQuery, [data, gid], (err) => {
                    dbConn.end()
                    if (err){
                        return callback(err)
                    }
                    return callback(null)
                })
            }})
    },
    //Bonus endpoint: GET /game/:id/image
    getImagebyID: function(gid, callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
            if (err) {//database connection issue
                return callback(err);
            } else {
                const getImageQuery = 
                `SELECT image from games WHERE gameid = ?`
                dbConn.query(getImageQuery, gid, (err, img) => {
                    dbConn.end()
                    if (err){
                        return callback(err, null)
                    }
                    return callback(null, img[0].image)
                })
            }})
    }
};

module.exports = game;


