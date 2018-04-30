module.exports = function(app , swig) {
    app.get("/signup", function(req, res) {
        res.send("Registrarse");
    });

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

