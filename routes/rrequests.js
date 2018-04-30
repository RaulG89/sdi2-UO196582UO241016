module.exports = function(app,swig){

    app.get("/requests", function(req,res){
        res.send("ListarPeticiones");
    });

    app.get("/request/send", function(req,res){
        res.send("EnviarPetición");
    });

    app.get("/requests/accept", function(req,res){
        res.send("AceptarPetición")
    })

};