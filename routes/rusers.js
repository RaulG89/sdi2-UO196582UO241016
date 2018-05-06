module.exports = function (app, swig, gestorBD) {
    app.get("/signup", function (req, res) {
        var respuesta = swig.renderFile('views/signup.html', {});
        res.send(respuesta);
    });
    app.post('/usuario', function (req, res) {
        var seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
            .update(req.body.password).digest('hex');
        var usuario = {
            email: req.body.email,
            password: seguro
        }
        var criterio = {email: req.body.email};
        gestorBD.obtenerUsuarios(criterio, function (usuarios) {
            if (usuarios == null || usuarios.length == 0) {
                gestorBD.insertarUsuario(usuario, function (id) {
                    if (id == null) {
                        res.redirect("/signup?mensaje=Error al registrar usuario")
                    } else {
                        res.redirect("/signin?mensaje=Nuevo usuario registrado");
                    }
                });
            } else {
                res.redirect("/signup?mensaje=Ya existe un usuario con este email.")
            }
        });

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
            } else {

                var pgUltima = total / 5;
                if (total % 5 > 0) { // Sobran decimales
                    pgUltima = pgUltima + 1;
                }

                var respuesta = swig.renderFile('views/users.html', {
                    usuarios: usuarios,
                    pgActual: pg,
                    pgUltima: pgUltima
                });
                res.send(respuesta);
            }
        });
    });

    app.get('/friendrequest/:id', function (req, res) {
        var criterio = {email: req.session.usuario};
        gestorBD.obtenerUsuarios(criterio, function (usuarios) {
            if (usuarios == null || usuarios.length == 0) {
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
                                res.redirect("/user/list"
                                    + "?mensaje=Error al enviar petición, ya existe una amistad con este usuario"
                                    + "&tipoMensaje=alert-danger ");
                            } else {
                                gestorBD.addFriendRequest(request, function (idRequest) {
                                    if (idRequest == null) {
                                        res.send(respuesta);
                                    } else {
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
        var pg = parseInt(req.query.pg);
        if (req.query.pg == null) {
            pg = 1;
        }
        var criterion = {
            email: req.session.usuario
        };
        gestorBD.obtenerUsuarios(criterion, pg, function (users) {
            if (users != null) {
                var friendCriterion = {
                    user: gestorBD.mongo.ObjectID(users[0]._id)
                };

                gestorBD.getFriends(friendCriterion, function (friendship) {
                    var localUser;
                    var localUserId = [];

                    for (f in friendship) {
                        localUserId.push(
                            gestorBD.mongo.ObjectID(friendship[f].localUser)
                        )
                    }

                    localUser = {
                        _id: {
                            $in: localUserId
                        }
                    };

                    var pg = parseInt(req.query.pg);
                    if (req.query.pg == null) {
                        pg = 1;
                    }

                    gestorBD.obtenerUsuariosPg(localUser, pg, function (
                        friends, total) {
                        var lastPg = total / 5;

                        if (total % 5 > 0) {
                            lastPg = lastPg + 1;
                        }

                        var response = swig.renderFile(
                            'views/users.html', {
                                users: friends,
                                currentPg: pg,
                                lastPg: lastPg,
                                userSession: req.session.user
                            });

                        res.send(response);
                    });
                });
            } else {
                res.send("Error al listar amigos.");
            }
        });
    });

};

