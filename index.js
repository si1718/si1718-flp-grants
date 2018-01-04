var express = require("express");
var bodyParser = require('body-parser');
var MongoClient = require("mongodb").MongoClient;
var helmet = require("helmet");
var path = require("path");
var cors = require("cors");
var jwt = require("express-jwt");
var jwks = require('jwks-rsa');

var mdbURL = "mongodb://curro:curro@ds149855.mlab.com:49855/si1718-flp-grants";

var BASE_API_PATH = "/api/v1"


var port = (process.env.PORT || 10000);

var db;

MongoClient.connect(mdbURL, { native_parser: true }, (err, database) => {
    if (err) {
        console.log("CAN NOT CONNECT TO DB: " + err);
        process.exit(1);
    }

    db = database.collection("grants");



});

var app = express();

app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.json());
app.use(helmet());

app.use(cors());

app.listen(port, () => {
    console.log("Magic is happening on port " + port);
});

// Get a collection
app.get(BASE_API_PATH + '/grants', function(req, response) {
    console.log("INFO: New GET request to /grants");
    if (!Object.keys(req.query).length) {
        db.find({}).toArray(function(err, grants) {
            if (err) {
                console.error('WARNING: Error getting data from DB');
                response.sendStatus(500); // internal server error
            }
            else {
                //console.log("INFO: Sending grants: " + JSON.stringify(grants, 2, null));
                response.send(grants);
            }
        });
    }
    else {
        var query;
        var hasParam = true;

        if (req.query.title) {
            query = { 'title': { '$regex': '.*' + req.query.title + '.*', "$options":"i" } }
        }
        else if (req.query.reference) {
            query = { 'reference': { '$regex': '.*' + req.query.reference + '.*', "$options":"i" } }
        }
        else if (req.query.startDate) {
            query = { 'startDate': { '$regex': '.*' + req.query.startDate + '.*', "$options":"i" } }
        }
        else if (req.query.endDate) {
            query = { 'endDate': { '$regex': '.*' + req.query.endDate + '.*', "$options":"i" } }
        }
        else if (req.query.type) {
            query = { 'type': { '$regex': '.*' + req.query.type + '.*', "$options":"i" } }
        }
        else if (req.query.fundingOrganizations) {
            query = { 'fundingOrganizations': { '$regex': '.*' + req.query.fundingOrganizations + '.*', "$options":"i" } }
        }
        else if (req.query.leaders) {
            query = { 'leaders': { '$regex': '.*' + req.query.leaders + '.*', "$options":"i" } }
        }
        else if (req.query.teamMembers) {
            query = { 'teamMembers': { '$regex': '.*' + req.query.teamMembers + '.*', "$options":"i" } }
        }
        else if(req.query.skip || req.query.limit){
            query = {};
        } else{
            hasParam = false;
        }
        

        if (!hasParam) {
            console.log("WARNING: New GET request to /grants/:idGrant without idGrant, sending 400...");
            response.sendStatus(400); // bad request
        }
        else {
            console.log("INFO: New GET request to /grants/");

            console.log(query);
            
            var skipQuantity = req.query.skip;
            var limitQuantity = req.query.limit;
            if(!skipQuantity){
                skipQuantity = 0;
            }else{
                skipQuantity = parseInt(skipQuantity);
                if(isNaN(skipQuantity)){
                    skipQuantity = 0;
                }
            }
            if(!limitQuantity){
                limitQuantity = 10;
            }else{
                limitQuantity = parseInt(limitQuantity);
                if(isNaN(limitQuantity)){
                    limitQuantity = 10;
                }
                    
            }
            
            db.find(query, {skip: skipQuantity, limit: limitQuantity}).toArray(function(err, grants) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                }
                else {

                    if (grants) {
                        //console.log("INFO: Sending contact: " + JSON.stringify(grants, 2, null));
                        response.send(grants);
                    }
                    else {
                        console.log("WARNING: There are not any match grant");
                        response.sendStatus(404); // not found
                    }
                }
            });
        }
    }

});

//Get number of results
app.get(BASE_API_PATH + "/resultsCount", function(req, response) {
    console.log("INFO: New GET request to /grants");
    if (!Object.keys(req.query).length) {
        db.find({}).count(function(err, result) {
            if (err) {
                console.error('WARNING: Error getting data from DB');
                response.sendStatus(500); // internal server error
            }
            else {
                //console.log("INFO: Sending grants: " + JSON.stringify(grants, 2, null));
                response.send({"total" : result});
            }
        });
    }
    else {
        var query;
        var hasParam = true;

        if (req.query.title) {
            query = { 'title': { '$regex': '.*' + req.query.title + '.*', "$options":"i" } }
        }
        else if (req.query.reference) {
            query = { 'reference': { '$regex': '.*' + req.query.reference + '.*', "$options":"i" } }
        }
        else if (req.query.startDate) {
            query = { 'startDate': { '$regex': '.*' + req.query.startDate + '.*', "$options":"i" } }
        }
        else if (req.query.endDate) {
            query = { 'endDate': { '$regex': '.*' + req.query.endDate + '.*', "$options":"i" } }
        }
        else if (req.query.type) {
            query = { 'type': { '$regex': '.*' + req.query.type + '.*', "$options":"i" } }
        }
        else if (req.query.fundingOrganizations) {
            query = { 'fundingOrganizations': { '$regex': '.*' + req.query.fundingOrganizations + '.*', "$options":"i" } }
        }
        else if (req.query.leaders) {
            query = { 'leaders': { '$regex': '.*' + req.query.leaders + '.*', "$options":"i" } }
        }
        else if (req.query.teamMembers) {
            query = { 'teamMembers': { '$regex': '.*' + req.query.teamMembers + '.*', "$options":"i" } }
        }
        else {
            hasParam = false;
        }
        

        if (!hasParam) {
            console.log("WARNING: New GET request to /grants/:idGrant without idGrant, sending 400...");
            response.sendStatus(400); // bad request
        }
        else {
            console.log("INFO: New GET request to /grants/");

            console.log(query);
            
            db.find(query).count(function(err, result) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                }
                else {

                    if (result) {
                        response.send({"total" : result});
                    }
                    else {
                        console.log("WARNING: There are not any match grant");
                        response.sendStatus(404); // not found
                    }
                }
            });
        }
    }

});

// Get a single resource

app.get(BASE_API_PATH + "/grants/:idGrant", function(request, response) {
    var idGrant = request.params.idGrant;
    if (!idGrant) {
        console.log("WARNING: New GET request to /grants/:idGrant without idGrant, sending 400...");
        response.sendStatus(400); // bad request
    }
    else {
        console.log("INFO: New GET request to /grants/" + idGrant);
        db.findOne({ "idGrant": idGrant }, function(err, grant) {
            if (err) {
                console.error('WARNING: Error getting data from DB');
                response.sendStatus(500); // internal server error
            }
            else {

                if (grant) {
                    console.log("INFO: Sending contact: " + JSON.stringify(grant, 2, null));
                    response.send(grant);
                }
                else {
                    console.log("WARNING: There are not any contact with idGrant " + idGrant);
                    response.sendStatus(404); // not found
                }
            }
        });
    }
});

/* POST METHODS*/

app.post(BASE_API_PATH + '/grants', function(req, res) {
    var newGrant = req.body;
    if (!newGrant) {
        console.log("WARNING: New POST request to /grants/ without dissertation, sending 400...");
        res.sendStatus(400);
    }
    else {
        console.log("INFO: New POST request to /grants with body: " + JSON.stringify(newGrant, 2, null));
        if (!newGrant.title || !newGrant.leaders || !newGrant.teamMembers ||
            !newGrant.type || !newGrant.reference || !newGrant.startDate ||
            !newGrant.endDate || !newGrant.fundingOrganizations) {
            console.log("WARNING: The grant " + JSON.stringify(newGrant, 2, null) + " is not well-formed, sending 422...");
            res.sendStatus(422); // unprocessable entity
        }
        else {
            var idGrant = newGrant.reference.replace("/", "-").toLowerCase();
            newGrant.idGrant = idGrant;
            newGrant.viewURL = "https://si1718-flp-grants.herokuapp.com/#!/viewgrant/" + idGrant;
            db.findOne({ "idGrant": idGrant }, function(err, element) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    res.sendStatus(500); // internal server error
                }
                else {
                    if (element) {
                        console.log("WARNING: The dissertation " + JSON.stringify(newGrant, 2, null) + " already extis, sending 409...");
                        res.sendStatus(409); // conflict
                    }
                    else {
                        db.insertOne(req.body, (err, result) => {
                            if (err) {
                                console.error('WARNING: Error inserting data in DB');
                                res.sendStatus(500); // internal server error
                            }
                            else {
                                console.log("INFO: Adding dissertation " + JSON.stringify(newGrant, 2, null));
                                res.sendStatus(201);
                            }
                        });
                    }
                }
            });

        }

    }
});

//POST over a single resource
app.post(BASE_API_PATH + "/grants/:idGrant", function(request, response) {
    var idGrant = request.params.idGrant;
    console.log("WARNING: New POST request to /contacts/" + idGrant + ", sending 405...");
    response.sendStatus(405); // method not allowed
});

/* PUT METHODS*/

//PUT over a collection
app.put(BASE_API_PATH + "/grants", function(request, response) {
    console.log("WARNING: New PUT request to /contacts, sending 405...");
    response.sendStatus(405); // method not allowed
});

//PUT over a single resource
app.put(BASE_API_PATH + "/grants/:idGrant", function(request, response) {
    var updatedGrant = request.body;
    var idGrant = request.params.idGrant;
    if (!updatedGrant) {
        console.log("WARNING: New PUT request to /contacts/ without contact, sending 400...");
        response.sendStatus(400); // bad request
    }
    else {
        console.log("INFO: New PUT request to /grants/" + idGrant + " with data " + JSON.stringify(updatedGrant, 2, null));
        if (!updatedGrant.title || !updatedGrant.leaders || !updatedGrant.teamMembers ||
            !updatedGrant.type || !updatedGrant.startDate ||
            !updatedGrant.endDate || !updatedGrant.fundingOrganizations) {
            console.log("WARNING: The contact " + JSON.stringify(updatedGrant, 2, null) + " is not well-formed, sending 422...");
            response.sendStatus(422); // unprocessable entity
        }
        else {
            db.findOne({ "idGrant": idGrant }, function(err, grantToUpdate) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                }
                else {

                    if (grantToUpdate) {
                        updatedGrant.reference = grantToUpdate.reference;
                        updatedGrant.idGrant = grantToUpdate.idGrant;
                        db.update({ "idGrant": idGrant }, updatedGrant);

                        console.log("INFO: Modifying contact with idGrant " + idGrant + " with data " + JSON.stringify(updatedGrant, 2, null));
                        response.send(updatedGrant); // return the updated contact
                    }
                    else {
                        console.log("WARNING: There are not any contact with idGrant " + idGrant);
                        response.sendStatus(404); // not found
                    }
                }
            });
        }
    }
});


/* DELETE METHODS*/

//DELETE over a collection
app.delete(BASE_API_PATH + "/grants", function(request, response) {
    console.log("INFO: New DELETE request to /grants");
    db.remove({}, { multi: true }, function(err, numRemoved) {
        if (err) {
            console.error('WARNING: Error removing data from DB');
            response.sendStatus(500); // internal server error
        }
        else {
            if (numRemoved.result.n > 0) {
                console.log("INFO: All the contacts (" + numRemoved.result.n + ") have been succesfully deleted, sending 204...");
                response.sendStatus(204); // no content
            }
            else {
                console.log("WARNING: There are no grants to delete");
                response.sendStatus(404); // not found
            }
        }
    });
});

//DELETE over a single resource
app.delete(BASE_API_PATH + "/grants/:idGrant", function(request, response) {
    var idGrant = request.params.idGrant;
    if (!idGrant) {
        console.log("WARNING: New DELETE request to /contacts/:idGrant without idGrant, sending 400...");
        response.sendStatus(400); // bad request
    }
    else {
        console.log("INFO: New DELETE request to /contacts/" + idGrant);
        db.remove({ "idGrant": idGrant }, {}, function(err, numRemoved) {
            if (err) {
                console.error('WARNING: Error removing data from DB');
                response.sendStatus(500); // internal server error
            }
            else {
                console.log("INFO: Contacts removed: " + numRemoved.result.n);
                if (numRemoved.result.n === 1) {
                    console.log("INFO: The contact with idGrant " + idGrant + " has been succesfully deleted, sending 204...");
                    response.sendStatus(204); // no content
                }
                else {
                    console.log("WARNING: There are no contacts to delete");
                    response.sendStatus(404); // not found
                }
            }
        });
    }
});


/////////// API WITH SECURITY///////////


var mdbURL2 = "mongodb://admin:passwordCurro@ds129386.mlab.com:29386/si1718-flp-grants-secure";

var port2 = (process.env.PORT || 20000);

var BASE_API_PATH2 = "/api/v1.1"

var app2 = express();

app2.use(express.static(path.join(__dirname, "public")));

app2.use(bodyParser.json());
app2.use(helmet());

app2.use(cors());

//// SECURE AUTH0 PARAMS //////
var jwtCheck = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: "https://flunaperejon.eu.auth0.com/.well-known/jwks.json"
    }),
    audience: 'https://si1718-flp-grants-si1718curro.c9users.io/',
    issuer: "https://flunaperejon.eu.auth0.com/",
    algorithms: ['RS256']
});

///////////////////////////////

var db2;

MongoClient.connect(mdbURL2, { native_parser: true }, (err, database) => {
    if (err) {
        console.log("CAN NOT CONNECT TO DB: " + err);
        process.exit(1);
    }

    db2 = database.collection("grants");

});

// Get a collection

app.get(BASE_API_PATH2 + '/authorized', jwtCheck, function(req, res) {
    res.send('Secured Resource');
});

app.get(BASE_API_PATH2 + '/grants', jwtCheck, function(req, response) {
    console.log("INFO: New GET request to /grants");
    if (!Object.keys(req.query).length) {
        db2.find({}).toArray(function(err, grants) {
            if (err) {
                console.error('WARNING: Error getting data from DB');
                response.sendStatus(500); // internal server error
            }
            else {
                console.log("INFO: Sending grants: " + JSON.stringify(grants, 2, null));
                response.send(grants);
            }
        });
    }
    else {
        var query;
        var hasParam = true;

        if (req.query.title) {
            query = { 'title': { '$regex': '.*' + req.query.title + '.*' } }
        }
        else if (req.query.reference) {
            query = { 'reference': { '$regex': '.*' + req.query.reference + '.*' } }
        }
        else if (req.query.startDate) {
            query = { 'startDate': { '$regex': '.*' + req.query.startDate + '.*' } }
        }
        else if (req.query.endDate) {
            query = { 'endDate': { '$regex': '.*' + req.query.endDate + '.*' } }
        }
        else if (req.query.type) {
            query = { 'type': { '$regex': '.*' + req.query.type + '.*' } }
        }
        else if (req.query.fundingOrganizations) {
            query = { 'fundingOrganizations': { '$regex': '.*' + req.query.fundingOrganizations + '.*' } }
        }
        else if (req.query.leaders) {
            query = { 'leaders': { '$regex': '.*' + req.query.leaders + '.*' } }
        }
        else if (req.query.teamMembers) {
            query = { 'teamMembers': { '$regex': '.*' + req.query.teamMembers + '.*' } }
        }
        else {
            hasParam = false;
        }


        if (!hasParam) {
            console.log("WARNING: New GET request to /grants/:idGrant without idGrant, sending 400...");
            response.sendStatus(400); // bad request
        }
        else {
            console.log("INFO: New GET request to /grants/");

            console.log(query);

            db.find(query).toArray(function(err, grants) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                }
                else {

                    if (grants) {
                        console.log("INFO: Sending contact: " + JSON.stringify(grants, 2, null));
                        response.send(grants);
                    }
                    else {
                        console.log("WARNING: There are not any match grant");
                        response.sendStatus(404); // not found
                    }
                }
            });
        }
    }

});

