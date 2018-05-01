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
        var criterio = { email : req.body.email };
        gestorBD.obtenerUsuarios(criterio, function(usuarios){
           if(usuarios == null || usuarios.length == 0){
               gestorBD.insertarUsuario(usuario, function(id) {
                   if (id == null) {
                       res.redirect("/signup?mensaje=Error al registrar usuario")
                   } else {
                       res.redirect("/signin?mensaje=Nuevo usuario registrado");
                   }
               });
           }else{
               res.redirect("/signup?mensaje=Ya existe un usuario con este email.")
           }
        });

    });

    app.get("/signin", function(req, res) {
        var respuesta = swig.renderFile('views/signin.html', {});
        res.send(respuesta);
    });
    app.post("/signin", function(req, res) {
        var seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
            .update(req.body.password).digest('hex');
        var criterio = {
            email : req.body.email,
            password : seguro
        }
        gestorBD.obtenerUsuarios(criterio, function(usuarios) {
            if (usuarios == null || usuarios.length == 0) {
                req.session.usuario = null;
                res.redirect("/signin"
                    + "?mensaje=Email o password incorrecto"
                    + "&tipoMensaje=alert-danger ");
            } else {
                req.session.usuario = usuarios[0].email;
                res.redirect("/user/list");
            }
        });
    });

    app.get("/user/list", function(req,res){
        res.send("Logearse");
    });

    app.get("/friends", function(req,res){
        res.send("Amigos");
    });

};

