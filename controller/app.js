/* Author: Ritchie Yapp, Singapore Polytechnic
https://github.com/speckly
SP Games Backend assignement 1

Application level script using Express framework 
Date Created: 6 June 2023

TODO: Make sure to validate all input, length included, as they raise exceptions
during query. Check for foreign key stuff
Stuff after endpoint 5
*/
const multer = require('multer')
const bodyParser = require('body-parser')
var express = require('express')
const path = require('path')
var app = express()
const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../config.js"); 
var cors = require('cors');


//models
var user = require('../model/user.js')
var category = require('../model/category.js')
var platform = require('../model/platform.js')
var game = require('../model/game.js')
var review = require('../model/review.js')

app.options('*',cors());
app.use(cors());
app.use(express.static('./public')); //public html
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError || err.code === 'LIMIT_FILE_SIZE') {
        res.status(413).send({"error_code": "FILE_TOO_BIG", "message": "Image size should not exceed 1MB"});
    } else {
      next(err);
    }
});
const upload = multer({limits: {fileSize: 1000000}}).single('image')

//1: GET /users/ return HTTP 200 array of all users in database else HTTP 500
app.get('/users/', function(req, res){
    user.getUsers(function(err, result) {
        if (!err) {
            res.status(200).send(result);
        } else {
            res.status(500).send()
        }
    })
})

//2: POST /users/ return sqlreturn.userid with 200 else 500
// if email exists then 422 
app.post('/users/', function(req, res){
    data = req.body
    user.newUser(data, function(err, result) {
        if (!err) {
            res.status(201).send(result);
        } else if (err.code == 'ER_DUP_ENTRY'){
            res.status(422).send()
        } else {
            res.status(500).send()
        }
    })
})

//3: GET /users/:id/
app.get('/users/:id/', function(req, res){
    userID = req.params.id.replace(":", "")
    user.getUserbyID(userID, function(err, result) {
        if (!err) {
            res.send(result);
        } else {
            res.status(500).send()
        }
    })
})

//4: POST /category/
app.post('/category', function(req, res){
    data = req.body
    category.newCategory(data, function(err) {
        if (!err) {
            res.status(201).send();
        } else if (err.code == 'ER_DUP_ENTRY'){
            res.status(422).send()
        } else {
            res.status(500).send()
        }
    })
})

//5: POST /platform
app.post('/platform', function(req, res){
    data = req.body
    platform.newPlatform(data, function(err) {
        if (!err) {
            res.status(201).send();
        } else if (err.code == 'ER_DUP_ENTRY'){
            res.status(422).send()
        } else {
            res.status(500).send()
        }
    })
})

//6: POST /game
app.post('/game', function(req, res){
    data = req.body
    game.newGame(data, function(err, result) {
        if (!err) {
            res.status(201).send(result);
        } else {
            res.status(500).send()
        }
    })
})

//7: GET /game/:platform
app.get('/game/:platform', function(req, res){
    sort = req.query.sortBy
    pf = req.params.platform.replace(":", "")
    game.getByPlatform(pf, sort, function(err, result) {
        if (!err) {
            res.status(200).send(result);
        } else {
            res.status(500).send()
        }
    })
})

//8: DELETE /game/:id
app.delete('/game/:id', function(req, res) {
    id = req.params.id.replace(":", "")
    game.deletebyID(id, function(err) {
        if (!err) {
            res.status(204).send();
        } else {
            res.status(500).send()
        }
    })
})

//9: PUT /game/:id
app.put('/game/:id', function(req, res) {
    id = req.params.id.replace(":", "")
    data = req.body
    game.updateGame(id, data, function(err) {
        if (!err) {
            res.status(204).send();
        } else {
            res.status(500).send()
        }
    })
})

//10: POST /user/:uid/game/:gid/review
app.post('/user/:uid/game/:gid/review', function(req,res) {
    uid = req.params.uid.replace(":", "")
    gid = req.params.gid.replace(":", "")
    review.newReview(uid, gid, req.body, function (err, result) { 
        if (!err) {
            res.status(201).send(result);
        } else {
            res.status(500).send()
        }
    })
})

//11: GET /game/:id/review
app.get('/game/:id/review', function(req, res) {
    gid = req.params.id.replace(":", "")
    review.getByID(gid, function (err, result) { 
        if (!err) {
            res.status(200).send(result);
        } else {
            res.status(500).send()
        }
    })
})

//Endpoint 12 dependency
function checkFileType(file, callback) {
    const filetypes = /jpeg|jpg/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype); //identifiers used to indicate the nature and format of a file or a part of a file on the internet. 
    if (mimetype && extname) {
        return callback(null);
    } else {
        callback(400);
    }
}

//Bonus endpoint 12: PUT /game/:id/image
//Request schema, {image: <image>}
app.put('/game/:id/image', function(req, res) {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            res.status(413).send({"error_code": "FILE_TOO_BIG", "message": "Image size should not exceed 1MB"});
        } else {
            const file = req.file;
            gid = req.params.id.replace(":", "")
            checkFileType(file, function (err){
                if (err) {
                    res.status(400).send({"error_code": "BAD_FILE_EXTENSION", "message": "Only images with extension jpg are accepted"})
                } else {
                    //process
                    game.upload(gid, file.buffer, function (err) { 
                        if (!err) {
                            res.status(204).send();
                        } else {
                            res.status(500).send()
                        }
                    })
                }
            })
        }
    })
})

//Bonus endpoint 13: GET /game/:id/image
app.get('/game/:id/image', function(req, res) {
    gid = req.params.id.replace(":", "")
    game.getImagebyID(gid, function (err, image) { 
        if (image == null) {
            res.status(404).send({"error_code": "IMAGE_NOT_FOUND", "message": "Image not found for given gameid"})
        } else if (!err) {
            res.setHeader('Content-Type', 'image/jpeg');
            res.status(200).send(image);
        } else {
            res.status(500).send()
        }
    })
})
 
//Endpoint 14
app.get('/gameid/:id/', function(req, res) {
    gid = req.params.id.replace(":", "")
    game.getGamebyID(gid, function (err, result) { 
        if (!err) {
            res.status(200).send(result);
        } else {
            res.status(500).send()
        }
    })
})

//Endpoint 15
app.post('/user/auth/', function(req, res) {
    jwtSignCB = function (error, token) {
        if (error) {
            res.status(401).send();
            return;
        } 
        res.status(200).send({
            success: true,
            token: token,
            user_id: userID,
        });
    }
    data = req.body
    user.authUser(data, function (err, result) { 
        if (!err) {
            if (result == null) {
                res.status(200).send({success: false});
                return;
            }
            //generate the JSON web token
            userID = result.userid
            const payload = {user_id: userID};
            //Remember password: logs out after 1h else 30d
            if (data.remember == false){
                expireIn = '30d'
                jwt.sign(payload, JWT_SECRET, {algorithm: "HS256", expiresIn: expireIn}, jwtSignCB)
            } else {
                expireIn = '1h'
                jwt.sign(payload, JWT_SECRET, {algorithm: "HS256", expiresIn: expireIn}, jwtSignCB)
            }
        } else {
            res.status(500).send()
        }
    })
})

//Endpoint 16
app.post('/check', (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader === null || authHeader === undefined || !authHeader.startsWith("Bearer ")) {
        res.status(200).send({success: false});
        return;
    }
    const token = authHeader.replace("Bearer ", "");
    jwt.verify(token, JWT_SECRET, { algorithms: ["HS256"] }, (error, decodedToken) => {
        if (error) {
            res.status(200).send({success: false});
        } else {
            res.status(200).send({success: true});
        }
        next();
    });
})


//Endpoint 17: Get all categories
app.get("/category", (req, res) => {
    category.getAllCategories((err, result) => {
        if (err) {
            res.status(500).send()
        } else {
            res.status(200).send(result)
        }
    })
})


//Endpoint 18: Get all platforms
app.get("/platform", (req, res) => {
    platform.getAllPlatform((err, result) => {
        if (err) {
            res.status(500).send()
        } else {
            res.status(200).send(result)
        }
    })
})

//Endpoint 19: Update profile picture
app.put('/users/:id/pfp', function(req, res) {
    id = req.params.id.replace(":", "")
    data = req.body
    user.uploadProfilePic(data.src, id, function(err) {
        if (!err) {
            res.status(204).send();
        } else {
            console.log(err)
            res.status(500).send()
        }
    })
})

module.exports = app;