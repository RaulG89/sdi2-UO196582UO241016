module.exports = function (app, gestorBD) {
    app.get('/api/friends', function (req, res) {
        var token = req.body.token || req.query.token || req.headers['token'];

        var criterio = {email: app.get('jwt').decode(token, 'secreto').usuario};

        gestorBD.obtenerUsuarios(criterio, function (usuarios) {
            if (usuarios == null || usuarios.length == 0) {
                res.status(500);
                res.json({error: "Error al obtener las amistades."});
            } else {
                var criterioAmigos = {
                    user: gestorBD.mongo.ObjectID(usuarios[0]._id)
                };
                gestorBD.obtenerAmistades(criterioAmigos, function (amistades) {
                    var friend = {};
                    var idFriend = [];
                    for (amistad in amistades) {
                        idFriend.push(gestorBD.mongo
                            .ObjectID(amistades[amistad].friend))
                    }
                    friend = {
                        _id: {
                            $in: idFriend
                        }
                    };
                    gestorBD.obtenerUsuarios(friend, function (
                        friends) {
                        res.status(200);
                        res.send(JSON.stringify(friends));
                    });
                })
            }
        })
    });
}