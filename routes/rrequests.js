module.exports = function (app, swig, gestorBD) {

    app.get('/requests', function (req, res) {
        var criterio = {email: req.session.usuario};
        gestorBD.obtenerUsuarios(criterio, function (usuarios) {
            if (usuarios == null || usuarios.length == 0) {
                res.send("Error obteniendo peticiones.");
            } else {
                var request = {requested: gestorBD.mongo.ObjectID(usuarios[0]._id)};
                gestorBD.obtenerPeticiones(request, function (requests) {
                    var cosa = {};
                    var requestings = [];
                    for (peticion in requests) {
                        requestings.push(gestorBD.mongo.ObjectID(requests[peticion].requesting));
                    }
                    cosa = {_id: {$in: requestings}};

                    var pg = parseInt(req.query.pg); // Es String !!!
                    if (req.query.pg == null) { // Puede no venir el param
                        pg = 1;
                    }
                    gestorBD.obtenerUsuariosPg(cosa, pg, function (requestingusers, total) {
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
    /* app.get('/requests', function (req, res) {
        var criterio = {email: req.session.usuario};
        gestorBD.obtenerUsuarios(criterio, function (usuarios) {
            if (usuarios == null || usuarios.length == 0) {
                res.send("Error listando peticiones de amistad");
            } else {
                var peticion = {
                    requested: gestorBD.mongo.ObjectID(usuarios[0]._id)
                };

                gestorBD.obtenerPeticiones(peticion, function (peticiones) {
                    var mandador = {};
                    var idMandadores = [];

                    for (i in peticiones) {
                        idMandadores.push(gestorBD.mongo.ObjectID(peticiones[i].requesting));
                    }
                    mandador = {
                        _id: {$in: idMandadores}
                    };

                    var pg = parseInt(req.query.pg);
                    if (req.query.pg == null) {
                        pg = 1;
                    }
                    gestorBD.obtenerUsuariosPg(mandador, pg, function (usuariosPeticion, total) {
                        var pgUltima = total / 5;
                        if (total % 5 > 0) {
                            pgUltima = pgUltima + 1;
                        }
                        var respuesta = swig.renderFile('views/requests.html', {
                            usuarios: usuariosPeticion,
                            pgActual: pg,
                            pgUltima: pgUltima,
                            usuarioSesion: req.session.usuario
                        });
                        res.send(respuesta);
                    });
                });
            }
        });
    }) */

    app.get("/requests/accept/:id", function (req, res) {
        res.send("AceptarPetición de: " + req.params.id);
    })

}
;