var _ = require('lodash');
var dog = require('../models/dog.js');

module.exports = function (app) {
    //_dogs = [];

    // Create
    app.post('/dog', function (req, res) {
        var newdog = new dog(req.body);
        newdog.save(function (err) {
            if (err) {
                res.json({
                    info: 'error during dog create',
                    error: err
                });
            }
            res.json({
                info: 'dog created successfully'
            });
        })
        // _dogs.push(req.body);
        // res.json({
        //     info: 'dog created successfully'
        // });
    });

    // Read
    app.get('/dog', function (req, res) {
        // res.send(_dogs);
        dog.find(function (err, dogs) {
            if (err) {
                res.json({
                    info: 'error during find dogs',
                    error: err
                });
            };
            // res.json({
            //     info: 'dogs found successfully',
            //     data: dogs
            // });
            setTimeout(function () {
                res.json({
                    info: 'dogs found successfully',
                    data: dogs
                });
            }, 10000);
        });
    });

    app.get('/dog/:id', function (req, res) {
        // res.send(_.find(_dogs, {
        //     name: req.params.id
        // }));
        dog.findById(req.params.id, function (err, dogs) {
            if (err) {
                res.json({
                    info: 'error during find dog',
                    error: err
                });
            }
            if (dog) {
                res.json({
                    info: 'dog found successfully',
                    data: dogs
                });
            } else {
                res.json({
                    info: 'dog not found.'
                });
            }
        });
    });

    // Update
    app.put('/dog/:id', function (req, res) {
        // var index = _.findIndex(_dogs, {
        //     name: req.params.id
        // });
        // _.merge(_dogs[index], req.body);
        // res.json({
        //     info: 'dogs updated successfully'
        // });
        dog.findById(req.params.id, function (err, dog) {
            if (err) {
                res.json({
                    info: 'error during find dog',
                    error: err
                });
            }
            if (dog) {
                _.merge(dog, req.body);
                dog.save(function (err) {
                    if (err) {
                        res.json({
                            info: 'error during dog update',
                            error: err
                        });
                    }
                    res.json({
                        info: 'dog updated successfully'
                    });
                })
            } else {
                res.json({
                    info: 'dog not found.'
                });
            }
        });
    });

    // Delete
    app.delete('/dog/:id', function (req, res) {
        // _.remove(_dogs, function (dog) {
        //     return dog.name === req.params.id;
        // });
        // res.json({
        //     info: 'dogs removed successfully'
        // });
        dog.findByIdAndRemove(req.params.id, function (err) {
            if (err) {
                res.json({
                    info: 'error during remove dog',
                    error: err
                });
            }
            res.json({
                info: 'dog removed successfully'
            });
        });
    });
}