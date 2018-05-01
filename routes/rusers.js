module.exports = function(app , swig, gestorBD) {
    app.get("/signup", function(req, res) {
        var respuesta = swig.renderFile('views/signup.html', {});
        res.send(respuesta);
    });
    app.post('/usuario', function(req, res) {
        var seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
            .update(req.body.password).digest('hex');
        var usuario = {
            email : req.body.email,
            password : seguro
        }
        gestorBD.insertarUsuario(usuario, function(id) {
            if (id == null) {
                res.redirect("/signup?mensaje=Error al registrar usuario")
            } else {
                res.redirect("/identificarse?mensaje=Nuevo usuario registrado");
            }
        });
    })

    app.get("/signin", function(req,res){
        res.send("Logearse");
    });

    app.get("/user/list", function(req,res){
        res.send("Logearse");
    });

    app.get("/friends", function(req,res){
        res.send("Amigos");
    });

};

