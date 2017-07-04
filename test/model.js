/* global describe, it */
'use strict';

var should = require('should');
var Model  = require('../');
var Schema = require('bazalt-schema');

describe('Test Model class', function() {

    it('Model check for no error if schema missing', function() {

        should(function() {

            // Create the Model
            new Model();

        }).not.throw();
    });

    it('Model check default value when new', function() {

        // Create the model
        var User = Model.generate('User', {
            username: Schema.Types.String,
            age: {
                type:    Schema.Types.Number,
                default: 18
            }
        });

        // Instantiate the model
        var user = new User();

        // Check default value if not defined
        should(user.username)
            .be.exactly(undefined);

        // Test get/set
        user.username = 'A string';

        // Check values
        should(user.username)
            .be.exactly('A string');

        // Check default value if defined
        should(user.age)
            .be.exactly(18);
    });

    it('Model check default value when .new()', function() {

        // Create the model
        var User = Model.generate('User', {
            username: Schema.Types.String,
            age: {
                type:    Schema.Types.Number,
                default: 18
            }
        });

        // Instantiate the model
        var user = User.new();

        // Check default value if not defined
        should(user.username)
            .be.exactly(undefined);

        // Test get/set
        user.username = 'A string';

        // Check values
        should(user.username)
            .be.exactly('A string');

        // Check default value if defined
        should(user.age)
            .be.exactly(18);
    });

    it('Model check default value when already exist', function() {

        // Create the model
        var User = Model.generate('User', {
            username: Schema.Types.String,
            age: {
                type:    Schema.Types.Number,
                default: 18
            }
        });

        // Instantiate the model
        var user = new User({
            username: 'John Doe'            
        }, false);

        // Check default value if is defined
        should(user.username)
            .be.exactly('John Doe');

        // Check default value if undefined when not new
        should(user.age)
            .be.exactly(undefined);
    });

    it('Model check default value when already exist with .new', function() {

        // Create the model
        var User = Model.generate('User', {
            username: Schema.Types.String,
            age: {
                type:    Schema.Types.Number,
                default: 18
            }
        });

        // Instantiate the model
        var user = User.new({
            username: 'John Doe'            
        }, false);

        // Check default value if is defined
        should(user.username)
            .be.exactly('John Doe');

        // Check default value if undefined when not new
        should(user.age)
            .be.exactly(undefined);
    });

    it('Model.EventsList should have three elements', function() {

        should(Model.EventsList).be.an.instanceOf(Array);
        should(Model.EventsList).have.a.length(3);

        should(Model.EventsList).containEql(Model.Events.Created);
        should(Model.EventsList).containEql(Model.Events.Updated);
        should(Model.EventsList).containEql(Model.Events.Destroyed);
    });
});
