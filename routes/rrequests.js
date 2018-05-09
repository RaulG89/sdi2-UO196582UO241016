module.exports = function (app, swig, gestorBD) {

    app.get('/requests', function (req, res) {
        var criterio = {email: req.session.usuario};
        gestorBD.obtenerUsuarios(criterio, function (usuarios) {
            if (usuarios == null || usuarios.length == 0) {
                res.send("Error obteniendo peticiones.");
            } else {
                var request = {requested: gestorBD.mongo.ObjectID(usuarios[0]._id)};
                gestorBD.obtenerPeticiones(request, function (requests) {
                    var peticiones = {};
                    var requestings = [];
                    for (peticion in requests) {
                        requestings.push(gestorBD.mongo.ObjectID(requests[peticion].requesting));
                    }
                    peticiones = {_id: {$in: requestings}};

                    var pg = parseInt(req.query.pg); // Es String !!!
                    if (req.query.pg == null) { // Puede no venir el param
                        pg = 1;
                    }
                    gestorBD.obtenerUsuariosPg(peticiones, pg, function (requestingusers, total) {
                        var pgUltima = total / 5;
                        if (total % 5 > 0) { // Sobran decimales
                            pgUltima = pgUltima + 1;
                        }

                        var respuesta = swig.renderFile('views/requests.html', {
                            usuarios: requestingusers,
                            pgActual: pg,
                            pgUltima: pgUltima,
                            usuario: req.session.usuario
                        });
                        res.send(respuesta);
                    })
                })
            }
        });
    });

    app.get("/requests/accept/:id", function (req, res) {
        var criterion = {email: req.session.usuario};
        gestorBD.obtenerUsuarios(criterion, function (usuarios) {
            if (usuarios == null || usuarios.length == 0) {
                res.redirect("/user/list"
                    + "?mensaje=Error al aceptar petición"
                    + "&tipoMensaje=alert-danger ");
            } else {
                var friendships = [];
                var friendship1 = {
                    user: gestorBD.mongo.ObjectID(req.params.id),
                    friend: gestorBD.mongo.ObjectID(usuarios[0]._id)
                }
                var friendship2 = {
                    user: gestorBD.mongo.ObjectID(usuarios[0]._id),
                    friend: gestorBD.mongo.ObjectID(req.params.id)
                }
                friendships.push(friendship1);
                friendships.push(friendship2);
                gestorBD.addFriendship(friendships, function (idFriendship) {
                    if (idFriendship == null) {
                        res.redirect("/user/list"
                            + "?mensaje=Error al aceptar petición"
                            + "&tipoMensaje=alert-danger ");
                    } else {
                        var requestAB = {
                            requested: gestorBD.mongo.ObjectID(req.params.id),
                            requesting: gestorBD.mongo.ObjectID(usuarios[0]._id)
                        };
                        var requestBA = {
                            requested: gestorBD.mongo.ObjectID(usuarios[0]._id),
                            requesting: gestorBD.mongo.ObjectID(req.params.id)
                        };
                        gestorBD.removeFriendRequest(requestAB, function(request){
                            gestorBD.removeFriendRequest(requestBA, function(request){
                                res.redirect("/user/list"
                                    + "?mensaje=Amistad aceptada correctamente."
                                    + "&tipoMensaje=alert-success ");
                            })
                        })

                    }
                });
            }
        });
    });

};