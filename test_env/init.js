/*Author: Ritchie Yapp 
https://github.com/speckly 

init.js: script used to insert test cases for each table in the sp_games schema.
NOTE: does not work for reviews due to asynchronous programming issues*/

var db = require('../model/databaseConfig.js')
var game = require('../model/game')

//Remove fields since i assume the order is correct when using Object.values
queries = {
    "./test_user.json": {
        "query":  `INSERT INTO user 
        (username, email, password, type, profile_pic_url) 
        VALUES (?, ?, ?, ?, ?);`,
        "fields": ["username", "email", "password", "type", "profile_pic_url"]
    },
    "./test_category.json": {
        "query": `INSERT INTO categories
        (catname, description)
        VALUES (?, ?)`,
        "fields": ["catname", "description"]
    },
    "./test_platform.json": {
        "query": `INSERT INTO platforms
        (platform_name, description)
        VALUES (?, ?)`,
        "fields": ["platform_name", "description"]
    },
    
    "./test_game.json":  {
        "query": `INSERT INTO games
        (title, description, categoryid, year)
        VALUES (?, ?, ?, ?, ?, ?)`,
        "fields": ["title", "description", "categoryid", "year"]
    },
    
    "./test_review.json": {
        "query": `INSERT INTO reviews
        (userid, gameid, content, rating)
        VALUES (?, ?, ?, ?)`,
        "fields": ["userid", "gameid", "content", "rating"]
    },
}

function getData(fileName){
    data = require(fileName)
    //Perform queries in sequential order else foreign key contstraint terminates the query
    return {
        "query": queries[fileName]["query"],
        "fields": Object.values(data)
    }
}


function insertTest(fileName) { 
    var dbConn = db.getConnection();
    dbConn.connect(function(err) {
        if (err) {//database connection issue
            console.log("Error in database connection, quitting");
            exit()
        } else {
            if (fileName == "./test_game.json"){
                data = require(fileName)
                game.newGame(data, function(err) {
                    if (err) {
                        console.log(`Error in game init: ${err}`)
                    }
                })
            } else if (fileName == "./test_platform.json") {
                data = require(fileName)
                Object.keys(data).forEach((key) => {
                    dbConn.query(queries[fileName].query, [data[key].platform_name, data[key].description], function(err) {
                        if (err) {
                            console.log(`Error in ${fileName}: ${err}`)
                        }
                    })
                })
                
            } else {
                session = getData(fileName)
                dbConn.query(session.query, session.fields, function(err) {
                    if (err) {
                        console.log(`Error in ${fileName}: ${err}`)
                    }
                })
            }
            dbConn.end()
        }
    })
}

Object.keys(queries).forEach(insertTest)