module.exports = function (app, gestorBD){

    app.post("/api/users/", function(req, res) {
        var seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
            .update(req.body.password).digest('hex');
        var criterio = {
            email : req.body.email,
            password : seguro
        }

        gestorBD.obtenerUsuarios(criterio, function(usuarios) {
            if (usuarios == null || usuarios.length == 0) {
                res.status(401); // Unauthorized
                res.json({
                    autenticado : false,
                    mensaje: "La autenticación no se ha completado con éxito."
                })
            } else {
                var token = app.get('jwt').sign(
                    {usuario: criterio.email , tiempo: Date.now()/1000},
                    "secreto");
                res.status(200);
                res.json({
                    autenticado : true,
                    token : token
                })
            }

        });
    });

    app.get('/api/users', function (req, res) {
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