var r = require('request').defaults({
    json: true
});

var async = require('async');
var redis = require('redis');
var ops = {
    auth_pass: 'ILT2dzhnxXnbJul7Vbs0rWfAyzV4HowL7TdoikNMQuE=',
    tls: {
        servername: 'SimplifiedPORedisBPRT.redis.cache.windows.net'
    }
};

var client = redis.createClient(6380, 'SimplifiedPORedisBPRT.redis.cache.windows.net', ops);

module.exports = function (app) {

    // Read
    app.get('/pets', function (req, res) {
        async.parallel({
                cat: function (callback) {
                    r({
                        uri: 'http://localhost:3000/cat'
                    }, function (error, response, body) {
                        if (error) {
                            callback({
                                service: 'cat',
                                error: error
                            });
                            return;
                        }
                        if (!error && response.statusCode === 200) {
                            callback(null, body.data);
                        } else {
                            callback(response.statusCode);
                        }
                    });
                },
                dog: function (callback) {
                    r({
                        uri: 'http://localhost:3001/dog'
                    }, function (error, response, body) {
                        if (error) {
                            callback({
                                service: 'cat',
                                error: error
                            });
                            return;
                        }
                        if (!error && response.statusCode === 200) {
                            callback(null, body);
                        } else {
                            callback(response.statusCode);
                        }
                    });
                }
            },
            function (error, results) {
                var y;
                var x;
                for (x = 0; x < 100000; x++) {
                    y = y + x;
                    console.log(x);
                }
                res.json({
                    error: error,
                    results: results
                });
            });
    });

    app.get('/ping', function (req, res) {
        res.json({
            pong: Date.now()
        });
    });

    app.get('/catname/:id', function (req, res) {
        client.get(req.params.id, function (error, cat) {
            if (error) {
                throw error;
            };
            if (cat) {
                res.json(JSON.parse(cat));
            } else {
                r({
                    uri: 'http://localhost:3000/cat/' + req.params.id
                }, function (error, response, body) {
                    if (error) {
                        throw error;
                    };
                    if (!error && response.statusCode === 200) {
                        res.json(body);
                        // client.set(req.params.id, JSON.stringify(body), function (error) {
                        client.setex(req.params.id, 10, JSON.stringify(body), function (error) {
                            if (error) {
                                throw error;
                            }
                        });
                    } else {
                        res.send(response.statusCode);
                    }
                });
            }
        });
    });
};