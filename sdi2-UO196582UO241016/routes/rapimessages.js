module.exports = function (app, gestorBD) {

    app.post('/api/message', function (req, res) {
        var token = req.body.token || req.query.token || req.headers['token'];

        var criterio = {email: app.get('jwt').decode(token, 'secreto').usuario};

        gestorBD.obtenerUsuarios(criterio, function (users) {
            if (users == null || users.length == 0) {
                app.get("logger").warn("Error al crear mensaje desde '/api/message' por "
                    + criterio.email + ". Error al obtener las amistades.");
                res.status(500);
                res.json({error: "Error al obtener las amistades."});
            } else {
                var friend = {_id: gestorBD.mongo.ObjectID(req.body.destination)};
                gestorBD.obtenerUsuarios(friend, function (userFriend) {
                    if (userFriend == null || userFriend.length == 0) {
                        app.get("logger").warn("Error al crear mensaje desde '/api/message' por "
                            + criterio.email + ". No existe el usuario receptor del mensaje.");
                        res.status(500);
                        res.json({
                            error: "No existe el usuario receptor del mensaje."
                        })
                    } else {
                        var criterioFriendship = {
                            user: gestorBD.mongo.ObjectID(userFriend[0]._id),
                            friend: gestorBD.mongo.ObjectID(users[0]._id)
                        };
                        gestorBD.obtenerAmistades(criterioFriendship, function (friendship) {
                            if (friendship == null || friendship.length == 0) {
                                app.get("logger").warn("Error al crear mensaje desde '/api/message' por "
                                    + criterio.email + ". No existe una relación de amistad entre los usuarios.");
                                res.status(500);
                                res.json({
                                    error: "No existe una relación de amistad entre los usuarios."
                                })
                            } else {
                                var msg = {
                                    sender: users[0],
                                    destination: userFriend[0],
                                    text: req.body.text,
                                    date: Date.now(),
                                    read: false
                                }
                                gestorBD.addMessage(msg, function (idMsg) {
                                    if (idMsg == null || idMsg.length == 0) {
                                        app.get("logger").warn("Error al crear mensaje desde '/api/message' por "
                                            + criterio.email + ". No existe una relación de amistad entre los usuarios.");
                                        res.status(500);
                                        res.json({error: "Error creando el mensaje."});
                                    } else {
                                        app.get("logger").info("Mensaje creado correctamente desde '/api/message' por "
                                            + criterio.email + ".");
                                        res.status(201);
                                        res.json({
                                            _id: idMsg,
                                            msg: "Mensaje creado."
                                        })
                                    }
                                })
                            }
                        });
                    }
                })
            }
        });
    });

    app.get("/api/message/:id", function(req,res){
        var token = req.body.token || req.query.token || req.headers['token'];

        var userSession = {email: app.get('jwt').decode(token, 'secreto').usuario};

        gestorBD.obtenerUsuarios(userSession, function (users) {
            if (users == null || users.length == 0) {
                app.get("logger").warn("Error al obtener mensajes desde '/api/message' por "
                    + userSession.email + ".");
                res.status(500);
                res.json({error: "Error al obtener mensajes."});
            } else {
                var counterCriterion = {
                    "destination._id" : gestorBD.mongo.ObjectID(users[0]._id),
                    "sender._id" : gestorBD.mongo.ObjectID(req.params.id),
                    read : false
                }

                var criterion = {
                    $or : [{
                        "sender._id" : gestorBD.mongo.ObjectID(users[0]._id),
                        "destination._id" : gestorBD.mongo.ObjectID(req.params.id)
                    },{
                        "destination._id" : gestorBD.mongo.ObjectID(users[0]._id),
                        "sender._id" : gestorBD.mongo.ObjectID(req.params.id)
                    }]
                };

                gestorBD.getMessages(criterion, counterCriterion, function(messages, count){
                    app.get("logger").info("Mensajes obtenidos correctamente desde '/api/message' por "
                        + userSession.email + ".");
                    res.status(200);
                    res.json({
                        messages : messages,
                        number : count
                    })
                });
            }
        });
    });

    app.put('/api/message/:id', function (req, res) {

        var token = req.body.token || req.query.token || req.headers['token'];
        var criterion = {
            email: app.get('jwt').decode(token, 'secreto').usuario
        };
        gestorBD.obtenerUsuarios(criterion, function (users) {
            if (users == null || users.length == 0) {
                app.get("logger").warn("Error al marcar mensaje como leído desde '/api/message' por "
                    + criterion.email + ". Error al listar usuarios.");
                res.status(500);
                res.json({
                    error: "Error al listar usuarios."
                })
            } else {
                var messageCriterion = {
                    $and: [{
                               "_id": gestorBD.mongo.ObjectID(req.params.id)
                            },

                            {
                                "destination._id": users[0]._id
                            }]
                };

                var message = {
                    read: true
                };
                gestorBD.updateMessage(messageCriterion, message, function (result) {
                    if (result == null) {
                        app.get("logger").warn("Error al marcar mensaje como leído desde '/api/message' por "
                            + criterion.email + ". Error de actualziación.");
                        res.status(500);
                        res.json({
                            error: "Se ha producido un error."
                        })
                    } else {
                        res.status(200);
                        res.json({
                            message: "Mensaje leido.",
                            _id: req.params.id
                        })
                    }
                });
            }
        });
    });
}