/* global describe, it */
'use strict';

var should = require('should');
var Model  = require('../');
var Schema = require('bazalt-schema');

describe('Test Model.save() method', function() {

    it('Model.save() with a new Document', function(done) {

        // Create the model
        var User = Model.generate('User', {
            username: Schema.Types.String
        });

        // Instantiate the model
        var user = new User({
            username: 'Test'
        });

        var counter      = 0,
            doneTwoTimes = function() {
                counter++;

                if(2 === counter) {
                    done();
                }
            };

        user.on('created', function(err) {

            should(err).be.exactly(null);

            doneTwoTimes();
        });

        user.save(function(err) {

            should(err).be.exactly(null);

            doneTwoTimes();
        });
    });

    it('Model.save() with a new Document without callback', function(done) {

        // Create the model
        var User = Model.generate('User', {
            username: Schema.Types.String
        });

        // Instantiate the model
        var user = new User({
            username: 'Test'
        });

        user.on('created', function(err) {

            should(err).be.exactly(null);

            done();
        });

        user.save();
    });

    it('Model.save() with invalid values', function(done) {

        // Create the model
        var User = Model.generate('User', {
            username: Schema.Types.String,
            age:     Schema.Types.Number
        });

        // Instantiate the model
        var user = new User({
            username: 'Root',
            age:      NaN
        });

        user.save(function(err) {

            should(err.age).be.an.instanceOf(Error);

            done();
        });
    });

    it('Model.save() with an existing Document', function(done) {

        // Create the model
        var User = Model.generate('User', {
            username: Schema.Types.String
        });

        // Instantiate the model
        var user = new User({
            username: 'Test'
        }, false);

        var counter      = 0,
            doneTwoTimes = function() {
                counter++;

                if(2 === counter) {
                    done();
                }
            };

        user.on('updated', function(err) {

            should(err).be.exactly(null);

            doneTwoTimes();
        });

        user.save(function(err) {

            should(err).be.exactly(null);

            doneTwoTimes();
        });
    });

    it('Model.save() with an existing Document without callback', function(done) {

        // Create the model
        var User = Model.generate('User', {
            username: Schema.Types.String
        });

        // Instantiate the model
        var user = new User({
            username: 'Test'
        }, false);

        user.on('updated', function(err) {
            should(err).be.exactly(null);

            done();
        });

        user.save();
    });
});
