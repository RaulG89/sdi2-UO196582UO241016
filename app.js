//Modules
var express = require('express');
var app = express();
var swig = require('swig');
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));


//Ruters/controllers
require("./routes/rusuarios.js")(app, swig);

//Server launcher
app.set('port', 8081);
app.listen(app.get('port'), function() {
    console.log("Servidor activo");
});
