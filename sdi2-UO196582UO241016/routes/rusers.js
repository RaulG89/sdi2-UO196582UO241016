module.exports = function (app, swig, gestorBD) {

    app.get("/signup", function (req, res) {
        var respuesta = swig.renderFile('views/signup.html', {});
        res.send(respuesta);
    });

    app.post('/usuario', function (req, res) {
        if (req.body.password != req.body.repassword) {
            res.redirect("/signup?mensaje=Las contraseñas han de coincidir"
                + "&tipoMensaje=alert-danger ");
        } else {
            var seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
                .update(req.body.password).digest('hex');
            var usuario = {
                nombre: req.body.nombre,
                email: req.body.email,
                password: seguro
            }
            var criterio = {email: req.body.email};
            gestorBD.obtenerUsuarios(criterio, function (usuarios) {
                if (usuarios == null || usuarios.length == 0) {
                    gestorBD.insertarUsuario(usuario, function (id) {
                        if (id == null) {
                            app.get("logger").warn("Error al registrar usuario " + usuario.email);
                            res.redirect("/signup?mensaje=Error al registrar usuario");
                        } else {
                            app.get("logger").info("Usuario registrado " + usuario.email);
                            res.redirect("/signin?mensaje=Nuevo usuario registrado");
                        }
                    });
                } else {
                    app.get("logger").warn("Ya existe un usuario con email " + usuario.email);
                    res.redirect("/signup?mensaje=Ya existe un usuario con este email.");
                }
            });
        }

    });

    app.get("/signin", function (req, res) {
        var respuesta = swig.renderFile('views/signin.html', {});
        res.send(respuesta);
    });

    app.post("/signin", function (req, res) {
        var seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
            .update(req.body.password).digest('hex');
        var criterio = {
            email: req.body.email,
            password: seguro
        }
        gestorBD.obtenerUsuarios(criterio, function (usuarios) {
            if (usuarios == null || usuarios.length == 0) {
                req.session.usuario = null;
                res.redirect("/signin"
                    + "?mensaje=Email o password incorrecto"
                    + "&tipoMensaje=alert-danger ");
            } else {
                req.session.usuario = usuarios[0].email;
                app.get("logger").info("Usuario identificado " + usuarios[0].email);
                res.redirect("/user/list");
            }
        });
    });

    app.get("/user/list", function (req, res) {
        var criterio = {};

        if (req.query.busqueda != null) {
            criterio = {
                $and: [{
                    "email": {$ne: req.session.usuario}
                }, {
                    $or: [{
                        "email": {
                            $regex: ".*" + req.query.busqueda + ".*"
                        }
                    }, {
                        "nombre": {
                            $regex: ".*" + req.query.busqueda + ".*"
                        }
                    }]
                }]
            };
        } else {
            criterio = {"email": {$ne: req.session.usuario}};
        }

        var pg = parseInt(req.query.pg); // Es String !!!
        if (req.query.pg == null) { // Puede no venir el param
            pg = 1;
        }
        gestorBD.obtenerUsuariosPg(criterio, pg, function (usuarios, total) {
            if (usuarios == null) {
                res.send("Error al listar ");
                app.get("logger").warn("Error al listar usuarios para " + req.session.usuario);
            } else {

                var pgUltima = total / 5;
                if (total % 5 > 0) { // Sobran decimales
                    pgUltima = pgUltima + 1;
                }

                var respuesta = swig.renderFile('views/users.html', {
                    usuario: req.session.usuario,
                    usuarios: usuarios,
                    pgActual: pg,
                    pgUltima: pgUltima,
                    busqueda: req.query.busqueda
                });
                res.send(respuesta);
            }
        });
    });

    app.get('/friendrequest/:id', function (req, res) {
        var criterio = {email: req.session.usuario};
        gestorBD.obtenerUsuarios(criterio, function (usuarios) {
            if (usuarios == null || usuarios.length == 0) {
                app.get("logger").warn("Error al enviar petición de amistad por "
                    + req.session.usuario);
                res.redirect("/user/list"
                    + "?mensaje=Error al enviar petición"
                    + "&tipoMensaje=alert-danger ");
            } else {
                var request = {
                    requested: gestorBD.mongo.ObjectID(req.params.id),
                    requesting: gestorBD.mongo.ObjectID(usuarios[0]._id)
                }
                gestorBD.obtenerPeticiones(request, function (requests) {
                    if (requests.length != 0) {
                        app.get("logger").warn("Error al enviar petición de amistad por "
                            + req.session.usuario + ", ya existe una petición enviada");
                        res.redirect("/user/list"
                            + "?mensaje=Error al enviar petición, ya existe una petición enviada."
                            + "&tipoMensaje=alert-danger ");
                    } else {
                        var friendship = {
                            requested: gestorBD.mongo.ObjectID(req.params.id),
                            requesting: usuarios[0]._id
                        }
                        gestorBD.obtenerAmistades(friendship, function (friendships) {
                            if (friendships.length != 0) {
                                app.get("logger").warn("Error al enviar petición de amistad por "
                                    + req.session.usuario + ", ya existe una amistad con este usuario");
                                res.redirect("/user/list"
                                    + "?mensaje=Error al enviar petición, ya existe una amistad con este usuario"
                                    + "&tipoMensaje=alert-danger ");
                            } else {
                                gestorBD.addFriendRequest(request, function (idRequest) {
                                    if (idRequest == null) {
                                        res.send(respuesta);
                                    } else {
                                        app.get("logger").info("Usuario " + req.session.usuario
                                            + " ha enviado una petición de amistad");
                                        res.redirect("/user/list"
                                            + "?mensaje=Petición de amistad enviada correctamente."
                                            + "&tipoMensaje=alert-success ");
                                    }
                                });
                            }
                        })
                    }
                    ;
                });

            }
        })
    });

    /*
    * Route that list all friends of the user in session.
    *
    */
    app.get("/friends", function (req, res) {

        var criterion = {
            email: req.session.usuario
        };
        gestorBD.obtenerUsuarios(criterion, function (users) {
            if (users != null) {
                var friendCriterion = {
                    user: gestorBD.mongo.ObjectID(users[0]._id)
                };

                gestorBD.getFriends(friendCriterion, function (friendships) {

                    var usersId = [];

                    for (friendship in friendships) {
                        usersId.push(
                            gestorBD.mongo.ObjectID(friendships[friendship].friend)
                        )
                    }

                    var idFriends = {
                        _id: {
                            $in: usersId
                        }
                    };

                    var pg = parseInt(req.query.pg);
                    if (req.query.pg == null) {
                        pg = 1;
                    }

                    gestorBD.obtenerUsuariosPg(idFriends, pg, function (
                        friends, total) {
                        var lastPg = total / 5;

                        if (total % 5 > 0) {
                            lastPg = lastPg + 1;
                        }

                        var response = swig.renderFile(
                            'views/friends.html', {
                                usuario: req.session.usuario,
                                friends: friends,
                                currentPg: pg,
                                lastPg: lastPg,
                            });

                        res.send(response);
                    });
                });
            } else {
                app.get("logger").warn("Error al listar amigos por " + req.session.usuario);
                res.send("Error al listar amigos.");
            }
        });
    });

    app.get("/logout", function (req, res) {
        var respuesta = swig.renderFile('views/index.html', {
            usuario: null
        });
        app.get("logger").info("Usuario " + req.session.usuario + " ha cerrado sesión.");
        res.send(respuesta);
    });

    app.get("/erasedatatest", function(req, res){
        gestorBD.eraseDataForTest(function(){
            res.send("Test data base erased.");
        });
    });
};