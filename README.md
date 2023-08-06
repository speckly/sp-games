# Backend Development Module Assignment 2, p2205810

# Setup
> Remote hosts are not supported 

It is preferred to host the web application with a hostname rather than accessing through `file://`

Document root should be set to `./controller/public`

Run the server using ```sh
node server.js```

# Endpoint 1: GET /users/
### Normal response: HTTP 200 OK 

# Endpoint 2: POST /users/
### Normal response: HTTP 201 Created

### Error response: HTTP 500 Internal Server Error on unknown error

### Error response: HTTP 422 on duplicate email

# Endpoint 3: GET /users/:id/
### Normal response: HTTP 200 OK 

# Endpoint 4: POST /category
### Normal response: HTTP 201 Created

### Error response: HTTP 500 Internal Server Error on unknown error

### Error response: HTTP 422 on duplicate catname

# Endpoint 5: POST /platform
### Normal response: HTTP 201 Created

### Error response: HTTP 500 Internal Server Error on unknown error

### Error response: HTTP 422 on duplicate platform_name

# Endpoint 6: POST /game
### Normal response: HTTP 201 Created

### Error response: HTTP 500 Internal Server Error on unknown error

# Endpoint 7: GET /game/:platform
### Normal response: HTTP 200 OK
Request requires one new attribute:
```json
sortBy: "name"
```
Endpoint now returns results ordered by title A-Z only if ```sortBy == "name"``` else returns results ordered from latest creation date to oldest

# Endpoint 8: DELETE /game/:id
### Normal response: HTTP 204 No Content

### Error response: HTTP 500 Internal Server Error on unknown error

# Endpoint 9: PUT /game/:id
### Normal response: HTTP 204 No Content

### Error response: HTTP 500 Internal Server Error on unknown error

# Endpoint 10: POST /user/:uid/game/:gid/review/
### Normal response: HTTP 201 Created

### Error response: HTTP 500 Internal Server Error on unknown error

# Endpoint 11: GET /game/:id/review
### Normal response: HTTP 204 OK
New response: 
```json
{
        "gameid": int from game,
        "content": varchar,
        "rating": int,
        "username": int from user,
        "userid": int from user,
        "profile_pic_url": varchar from user,
        "created_at": sql_timestamp from user
}
```
# Endpoint 12: PUT /game/:gid/image

**This endpoint assumes that the game with gameid=gid exists as it uses SQL UPDATE**

Allows upload and storage of image to games table. Image in the endpoint is validated to be below 1MB and is of jpg format. Replace gid with the gameid

Support only form-encoded requests with body: 
```json
{"image": <image data>}
```
### Responses: 
HTTP 204 No Content: Normal response, no content

HTTP 500 Internal Server Error: Unknown error, no content

HTTP 400 Bad Request: File extension is bad (not /jpg|jpeg/). Returns 
```json
{"error_code": "BAD_FILE_EXTENSION", "message": "Only images with extension jpg are accepted"}
```
HTTP 413 Content Too Large: File is too big but file extension is okay since it passed validation (exceeds 1MB and is /jpg|jpeg/). Returns
```json
{"error_code": "FILE_TOO_BIG", "message": "Image size should not exceed 1MB"}
```


# Fetch image endpoint 13: GET http://localhost:8081/game/:gid/image
Allows retrieval of a game's image by supplying :gid in the parameters.

### Responses: 
HTTP 200 OK: Normal response, no content

HTTP 500 Internal Server Error: Unknown error, no content

HTTP 404 Not Found: Image not found. Returns 
```json
{"error_code": "IMAGE_NOT_FOUND", "message": "Image not found for given gameid"}
```

# Endpoint 14: GET /gameid/:id/

This endpoint retrieves a game by its ID.
The :id parameter in the URL represents the game ID.
### Normal response: HTTP 200 OK 
```json
{
    "gameid": 0,
    "title": "",
    "description": "",
    "price": "",
    "platform": "",
    "catid": 0,
    "catname": "",
    "year": 0,
    "created_at": SQL_TIMESTAMP
}
```

# Endpoint 15: POST /user/auth/

This endpoint performs user authentication and generates a JSON Web Token (JWT) upon successful authentication.
The user credentials (username and password) are sent in the request body.

### Request:
> Passwords should be sent only after they are hashed using SHA-256 to prevent MITM attacks
```json
{
    "username": "example_user",
    "password": "6eba...",
    "remember": true
}
```

### Response (Success):
```json
HTTP 200 OK
Body: {
    "success": true,
    "token": "JWT_TOKEN",
    "user_id": 123
}
```

### Response (Unauthorized - Invalid Credentials):
```
HTTP 401 Unauthorized
```

### Response (Error - Internal Server Error):
```
HTTP 500 Internal Server Error
```

# Endpoint 16: POST /check

This endpoint checks the validity of a JSON Web Token (JWT) sent in the request header (Authorization header).
The JWT should be in the format "Bearer WT_TOKEN".

### Request:
```json
POST /check
Headers: {
    "Authorization": "Bearer JWT_TOKEN"
}
```

### Response (Success - Valid Token):
```json
HTTP 200 OK
Body: {
    "success": true
}
```

### Response (Success - Invalid Token or No Token Provided):
```json
HTTP 200 OK
Body: {
    "success": false
}
```

# Endpoint 17: GET /category

This endpoint retrieves all categories of games.

### Request:
```
GET /category
```

### Response (Success):
```json
HTTP 200 OK
Body: [
    {
        "id": 1,
        "name": "Adventure"
    },
    {
        "id": 2,
        "name": "Action"
    },
]
```

### Response (Error - Internal Server Error):
```
HTTP 500 Internal Server Error
```

# Endpoint 18: GET /platform

This endpoint retrieves all available platforms for games.

### Request:
```
GET /platform
```

### Response (Success):
```json
HTTP 200 OK
Body: [
    {
        "id": 1,
        "name": "PC"
    },
    {
        "id": 2,
        "name": "PlayStation"
    },
]
```

### Response (Error - Internal Server Error):
```
HTTP 500 Internal Server Error
```