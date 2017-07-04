/* global describe, it */
'use strict';

var should = require('should');
var Model  = require('../');
var Schema = require('bazalt-schema');

describe('Test Model.generate() method', function() {

    it('Model.generate() a new Model without an instance of Schema', function() {

        // Create the model
        var User = Model.generate('User', {
            username: Schema.Types.String
        });

        should(User.modelName)
            .be.exactly('User');

        // Instantiate the schema
        var user = new User();

        // Test get/set
        user.set('username', 'A string');

        // Check values
        should(user.get('username'))
            .be.exactly('A string');
        should(user.username)
            .be.exactly('A string');
    });

    it('Model.generate() a new Model without an instance of Schema and empty options', function() {

        // Create the model
        var User = Model.generate('User', {
            username: Schema.Types.String
        }, {});

        should(User.modelName)
            .be.exactly('User');

        // Instantiate the schema
        var user = new User();

        // Test get/set
        user.set('username', 'A string');

        // Check values
        should(user.get('username'))
            .be.exactly('A string');
        should(user.username)
            .be.exactly('A string');
    });

    it('Model.generate() a new Model with an instance of Schema', function() {

        // Instantiate the schema
        var schema = new Schema({
            username: Schema.Types.String
        });

        // Create the model
        var User = Model.generate('User', schema);

        should(User.modelName)
            .be.exactly('User');

        // Instantiate the schema without new
        var user = new User();

        // Test get/set
        user.username = 'A string';

        // Check values
        should(user.get('username'))
            .be.exactly('A string');
        should(user.username)
            .be.exactly('A string');
    });

    it('Model.generate() a new Model with an instance of Schema and empty options', function() {

        // Instantiate the schema
        var schema = new Schema({
            username: Schema.Types.String
        });

        // Create the model
        var User = Model.generate('User', schema, {});

        should(User.modelName)
            .be.exactly('User');

        // Instantiate the schema without new
        var user = new User();

        // Test get/set
        user.username = 'A string';

        // Check values
        should(user.get('username'))
            .be.exactly('A string');
        should(user.username)
            .be.exactly('A string');
    });

    it('Model.generate() a new Model, check invalid type', function() {

        // Create the model
        var User = Model.generate('User', {
            username: Schema.Types.String,
            age:      Schema.Types.Number
        });

        // Instantiate the model
        var user = new User();

        // Add invalid values
        user.username = NaN;
        user.age = 'ten';
    });
});
