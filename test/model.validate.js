/* global describe, it */
'use strict';

var should = require('should');
var Model  = require('../');
var Schema = require('bazalt-schema');

describe('Test Model.validate() method', function() {

    it('Model.validate() with valid data', function() {

        // Create the model
        var User = Model.generate('User', {
            username: Schema.Types.String,
            age:      Schema.Types.Number
        });

        // Instantiate the model
        var user = new User();

        user.username = 'A string';
        user.age      = 18;

        should(user.validate())
            .be.exactly(null);
    });

    it('Model.validate() with invalid data', function() {

        // Create the model
        var User = Model.generate('User', {
            username: Schema.Types.String,
            age:      Schema.Types.Number
        });

        // Instantiate the model
        var user = new User();

        user.age = NaN;

        should(user.validate())
            .be.instanceof(Object).and.have.property('age').be.instanceof(Error);
    });
});
