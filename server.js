var app = require('./controller/app.js')

var server = app.listen(8081, function() {
    console.log('Web App Hosted at http://localhost:%s', 8081)
})
