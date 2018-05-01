//Modules
var express = require('express');
var app = express();

var expressSession = require('express-session');
app.use(expressSession({
    secret: 'abcdefg',
    resave: true,
    saveUninitialized: true
}));
var crypto = require('crypto');
var mongo = require('mongodb');
var swig = require('swig');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var gestorBD = require("./modules/gestorBD.js");
gestorBD.init(app,mongo);

app.use(express.static('public'));

//Variables
app.set('port',8081);
app.set('db','mongodb://admin:sdi@ds245228.mlab.com:45228/tiendamusica');
app.set('clave','abcdefg');
app.set('crypto',crypto);

//Routers/controllers
require("./routes/rusers.js")(app, swig, gestorBD);
require("./routes/rrequests.js")(app, swig, gestorBD);

//Server launcher
app.set('port', 8081);
app.listen(app.get('port'), function() {
    console.log("Servidor activo");
});
