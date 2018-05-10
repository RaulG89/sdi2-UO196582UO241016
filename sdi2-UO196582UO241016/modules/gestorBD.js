module.exports = {
	mongo : null,
	app : null,
	init : function(app, mongo) {
		this.mongo = mongo;
		this.app = app;
	},
    obtenerUsuariosPg : function(criterio, pg, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var collection = db.collection('usuarios');
                collection.count(criterio, function(err, count) {
                    collection.find(criterio).skip((pg - 1) * 5).limit(5)
                        .toArray(function(err, usuarios) {
                            if (err) {
                                funcionCallback(null);
                            } else {
                                funcionCallback(usuarios, count);
                            }
                            db.close();
                        });
                });
            }
        });
    },
	insertarUsuario : function(usuario, funcionCallback) {
		this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
			if (err) {
				funcionCallback(null);
			} else {
				var collection = db.collection('usuarios');
				collection.insert(usuario, function(err, result) {
					if (err) {
						funcionCallback(null);
					} else {
						funcionCallback(result.ops[0]._id);
					}
					db.close();
				});
			}
		});
	},

    obtenerUsuarios : function(criterio, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var collection = db.collection('usuarios');
                collection.find(criterio).toArray(function(err, usuarios) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(usuarios);
                    }
                    db.close();
                });
            }
        });
    },

    addFriendRequest : function(request, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var collection = db.collection('requests');
                collection.insert(request, function(err, result) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(result.ops[0]._id);
                    }
                    db.close();
                });
            }
        });
    },

    removeFriendRequest : function(request, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var collection = db.collection('requests');
                collection.remove(request, function(err, result) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(result);
                    }
                    db.close();
                });
            }
        });
    },

    obtenerPeticiones : function(criterio, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var collection = db.collection('requests');
                collection.find(criterio).toArray(function(err, requests) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(requests);
                    }
                    db.close();
                });
            }
        });
    },

    obtenerAmistades : function(criterio, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var collection = db.collection('friendships');
                collection.find(criterio).toArray(function(err, friendships) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(friendships);
                    }
                    db.close();
                });
            }
        });
    },

    addFriendship : function(friendship, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var collection = db.collection('friendships');
                collection.insert(friendship, function(err, result) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(result.ops[0]._id);
                    }
                    db.close();
                });
            }
        });
    },
    getFriends : function(criterion, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var collection = db.collection('friendships');
                collection.find(criterion).toArray(function(err, friendships) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(friendships);
                    }
                    db.close();
                });
            }
        });
    },

    addMessage : function(mensaje, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var collection = db.collection('mensajes');
                collection.insert(mensaje, function(err, result) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(result.ops[0]._id);
                    }
                    db.close();
                });
            }
        });
    },

    getMessages : function(criterion, counterCriterion, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var collection = db.collection('mensajes');
                collection.count(counterCriterion, function(err, count) {
                    collection.find(criterion)
                        .toArray(function(err, messages) {
                            if (err) {
                                funcionCallback(null);
                            } else {
                                funcionCallback(messages, count);
                            }
                            db.close();
                        });
                });
            }
        });
    },

    updateMessage : function(criterion, message, functionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
            if (err) {
                functionCallback(null);
            } else {
                var collection = db.collection('mensajes');
                collection.update(criterion, {
                    $set : message
                }, function(err, result) {
                    if (err) {
                        functionCallback(null);
                    } else {
                        functionCallback(result);
                    }
                    db.close();
                });
            }
        });
    },

    /*eraseDataForTest : function(functionCallback){
        this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
            if (err) {
                functionCallback(null);
            } else {
                var collection = db.collection('usuarios');
                collection.remove({}, function (err, usuarios) {
                    if (err) {
                        functionCallback(null);
                    } else {
                        collection = db.collection('friendships');
                        collection.remove({}, function(err, peticiones){
                            if (err) {
                                functionCallback(null);
                            } else {
                                collection = db.collection('requests');
                                collection.remove({}, function(err, amistades){
                                    if(err) {
                                        console.log("HOLAAAAAAAAAAAAAAA!")
                                        functionCallback(null);
                                    }else{
                                        functionCallback(amistades);
                                    }
                                })
                            }
                            db.close();
                        })
                    }
                    db.close();
                })
            }
        });
    }*/

    eraseDataForTest : function(funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'),function(err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                db.collection('mensajes').drop(function(err, result) {
                    if (err) {funcionCallback(null);
                    } else {
                        db.collection('requests').drop(function(err,result) {
                            if (err) {
                                funcionCallback(null);
                            } else {
                                db.collection('friendships').drop(function(err,result) {
                                    if (err) {
                                        funcionCallback(null);
                                    } else {
                                        db.collection('usuarios').drop(function(err,result) {
                                            if (err) {
                                                console.log("YAAAAAAAAAAAAA");
                                                funcionCallback(null);
                                            } else {
                                                funcionCallback(result);
                                            }
                                            db.close();
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    }
};