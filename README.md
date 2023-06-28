!!!!!!!
# Please refer to documentation.docx for documentation with images
!!!!!!!

# Backend Development Module Assignment 1, p2205810

# Endpoint 1: GET /users/
### Normal response: HTTP 200 OK 

# Endpoint 2: POST /users/
### Normal response: HTTP 201 Created

### Error response: HTTP 500 Internal Server Error on unknown error
Here, a key is misspelled.

### Error response: HTTP 422 on duplicate email

# Endpoint 3: GET /users/:id/
### Normal response: HTTP 200 OK 

# Endpoint 4: POST /category
### Normal response: HTTP 201 Created

### Error response: HTTP 500 Internal Server Error on unknown errora
Here, a key is misspelled.

### Error response: HTTP 422 on duplicate catname

# Endpoint 5: POST /platform
### Normal response: HTTP 201 Created

### Error response: HTTP 500 Internal Server Error on unknown error
Here, a key is misspelled.

### Error response: HTTP 422 on duplicate platform_name

# Endpoint 6: POST /game
### Normal response: HTTP 201 Created

### Error response: HTTP 500 Internal Server Error on unknown error
Here, a key is misspelled.

# Endpoint 7: GET /game/:platform
### Normal response: HTTP 200 OK

# Endpoint 8: DELETE /game/:id
### Normal response: HTTP 204 No Content

### Error response: HTTP 500 Internal Server Error on unknown error
Id doesnt exist?
# Endpoint 9: PUT /game/:id
### Normal response: HTTP 204 No Content

### Error response: HTTP 500 Internal Server Error on unknown error
Here, a key is misspelled.

# Endpoint 10: POST /user/:uid/game/:gid/review/
### Normal response: HTTP 201 Created

### Error response: HTTP 500 Internal Server Error on unknown error
Here, a key is misspelled.

# Endpoint 11: GET /game/:id/review
### Normal response: HTTP 204 OK


# Additional feature documentation: Image upload and fetch
Allows upload and storage of image to games table. Image in the endpoint is validated to be below 1MB and is of jpg format

### Usage: 

Run server.js in the root directory and endpoints will be available. 

**This endpoint assumes that the game with gameid=gid exists as it uses SQL UPDATE**
Upload image endpoint: PUT http://localhost:8081/game/:gid/image
Replace gid with the gameid
Support only form-encoded requests with body: 
```json
{"image": <image data>}
```

Fetch image endpoint: GET http://localhost:8081/game/:gid/image
Replace gid with the gameid

### Responses: 
##### PUT http://localhost:8081/game/:gid/image
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

##### GET http://localhost:8081/game/:gid/image
HTTP 200 OK: Normal response, no content
HTTP 500 Internal Server Error: Unknown error, no content
HTTP 404 Not Found: Image not found. Returns 
```json
{"error_code": "IMAGE_NOT_FOUND", "message": "Image not found for given gameid"}
```

# Additional feature documentation: SHA256 hashing of user passwords: