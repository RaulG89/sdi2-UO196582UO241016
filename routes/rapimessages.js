module.exports = function (app, gestorBD) {
    app.post('/api/message', function (req, res) {
        var token = req.body.token || req.query.token || req.headers['token'];

        var criterio = {email: app.get('jwt').decode(token, 'secreto').usuario};

        gestorBD.obtenerUsuarios(criterio, function (users) {
            if (users == null || users.length == 0) {
                res.status(500);
                res.json({error: "Error al obtener las amistades."});
            } else {
                var friend = {_id: gestorBD.mongo.ObjectID(req.body.destination)};
                gestorBD.obtenerUsuarios(friend, function (userFriend) {
                    if (userFriend == null || userFriend.length == 0) {
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
                                gestorBD.crearMensaje(msg, function (idMsg) {
                                    if (idMsg == null || idMsg.length == 0) {
                                        res.status(500);
                                        res.json({error: "Error creando el mensaje."});
                                    } else {
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
}