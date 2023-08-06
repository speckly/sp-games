/* Author: Ritchie Yapp, Singapore Polytechnic
https://github.com/speckly
SP Games Backend assignement 1

Models for /game endpoint and database interaction
Date Created: 6 June 2023

TODO: Make sure to validate all input, length included, as they raise exceptions
during query
*/

var db = require('./databaseConfig.js');

function transformGameData(inp) {
    inp.platformid = inp.platformid.split(",")
    inp.price = inp.price.split(",")
    newList = []
    if (inp.platformid.length != inp.price.length) {
        return null
    } else {
        //would be good if i can get the value of price but i can only use foreach on one thing
        inp.platformid.forEach((platform, priceIndex) => {
            newList.push([platform, inp.price[priceIndex]])
        })
        return newList
    }
}

var game = {
    //6: POST /game
    newGame: function(data, callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
            if (err) {//database connection issue
                return callback(err, null);
            } else {
                newGameQuery = `INSERT INTO games
                (title, description, categoryid, year)
                VALUES (?, ?, ?, ?)`
                newGamePriceQuery = `INSERT INTO gamepricing
                (gameid, platformid, price)
                VALUES (?, ?, ?)`
                transformData = transformGameData(data)
                if (transformData == null) {
                    err = {"error": "price length does not correspond with platformid length"}
                    return callback(err, null) //the data cannot be processed as prices do not correspond to the platforms
                } else {
                    gameData = [data.title, data.description, data.categoryid, data.year] 
                    dbConn.query(newGameQuery, gameData, (err, result) => {
                        if (err) {
                            return callback(err, null)
                        } else {
                            gameID = result.insertId
                            transformData.forEach((gameCol, currentIndex) => {
                                dbConn.query(newGamePriceQuery,[gameID].concat(gameCol), (err, result) => {
                                    if (err) {
                                        return callback(err, null)
                                    } else if (currentIndex == transformData.length-1) {
                                        return callback(null, {"gameid": gameID})
                                    }
                                })
                            })
                        }
                    })
                }
            }
        })
    },
    //7: GET /game/:platform
    getByPlatform: function(platform, sort, callback){
        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
            if (err) {//database connection issue
                return callback(err, null);
            } else {
                additionalQuery = (sort == "name") ? ' ORDER BY title ASC' : ' ORDER BY created_at ASC' //else latest
                //Note foriegn key contstraints platformid and categoryid raises exceptions if not found
                getByPlatformQuery = `SELECT games.gameid, games.title, games.description,
                gamepricing.price, platforms.platform_name AS platform, 
                games.categoryid AS catid, categories.catname, games.year, games.created_at
                FROM gamepricing 
                INNER JOIN platforms ON platforms.platformid = gamepricing.platformid
                INNER JOIN games ON gamepricing.gameid = games.gameid
                INNER JOIN categories ON games.categoryid = categories.categoryid
                WHERE platforms.platform_name = ?${additionalQuery};                
                `
                dbConn.query(getByPlatformQuery, platform, (err, result) => {
                    if (err){
                        return callback(err, null)
                    } else {
                        return callback(err, result)
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
                deleteGamePriceQuery = `DELETE FROM gamepricing WHERE gameid = ?;`
                dbConn.query(deleteGamePriceQuery, [id], (err) => {
                    if (err){
                        return callback(err)
                    } else {
                        deleteGameQuery = `DELETE FROM games WHERE gameid = ?;` 
                        dbConn.query(deleteGameQuery, [id], (err) => {
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
                year = ?
                WHERE gameid = ?;`
                dbConn.query(updateGameQuery, 
                    [data.title, data.description, data.categoryid, data.year, id], 
                    (err) => {
                        if (err){
                            return callback(err)
                        } else {
                            transformData = transformGameData(data)
                            if (transformData == null) {
                                err = {"error": "price length does not correspond with platformid length"}
                                return callback(err) //the data cannot be processed as prices do not correspond to the platforms
                            } else {
                                deleteGamePriceQuery = `DELETE FROM gamepricing WHERE gameid = ?`
                                dbConn.query(deleteGamePriceQuery, id, (err) => {
                                    if (err) {
                                        return callback(err)
                                    } else {
                                        updateGamePriceQuery = `INSERT INTO gamepricing
                                        (gameid, platformid, price)
                                        VALUES (?, ?, ?)`
                                        transformData.forEach((gameCol, currentIndex) => {
                                            dbConn.query(updateGamePriceQuery,[id].concat(gameCol), (err) => {
                                                if (err) {
                                                    return callback(err, null)
                                                } else if (currentIndex == transformData.length-1) {
                                                    dbConn.end()
                                                    return callback(null)
                                                }
                                            })
                                            
                                        })
                                    }
                                })
                            }
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
    },
    //Assignment 2 helpful endpoint: GET /gameid/:id/
    getGamebyID: function(gid, callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
            if (err) {//database connection issue
                return callback(err);
            } else {
                const getGameIDQuery = 
                `SELECT games.gameid, games.title, games.description,
                gamepricing.price, platforms.platform_name AS platform, 
                games.categoryid AS catid, categories.catname, games.year, games.created_at
                FROM gamepricing 
                INNER JOIN platforms ON platforms.platformid = gamepricing.platformid
                INNER JOIN games ON gamepricing.gameid = games.gameid
                INNER JOIN categories ON games.categoryid = categories.categoryid
                WHERE games.gameid = ?`
                dbConn.query(getGameIDQuery, gid, (err, result) => {
                    dbConn.end()
                    if (err){
                        return callback(err, null)
                    }
                    return callback(null, result[0])
                })
            }})
    },
};

module.exports = game;


