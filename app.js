//Modules
var express = require('express');
var app = express();
var swig = require('swig');
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));


//Routers/controllers
require("./routes/rusers.js")(app, swig);
require("./routes/rrequests.js")(app, swig);

//Server launcher
app.set('port', 8081);
app.listen(app.get('port'), function() {
    console.log("Servidor activo");
});
