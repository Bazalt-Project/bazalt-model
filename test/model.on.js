/* global describe, it */
'use strict';

var should = require('should');
var Model  = require('../');
var Schema = require('bazalt-schema');

describe('Test Model.on() method', function() {

    it('Model.on(changed)', function(done) {

        // Create the model
        var User = Model.generate('User', {
            username: Schema.Types.String
        });

        // Instantiate the model
        var user = new User();

        user.on('changed', function(key, value) {

            should(key).be.exactly('username');
            should(value).be.exactly('A String');

            done();
        });

        user.username = 'A String';
    });
});
