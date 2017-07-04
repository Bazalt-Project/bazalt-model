/* global describe, it */
'use strict';

var should = require('should');
var Model  = require('../');
var Schema = require('bazalt-schema');

describe('Test Model.destroy() method', function() {

    it('Model.destroy() with an existing Document', function(done) {

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

        user.on('destroyed', function(err) {

            should(err).be.exactly(null);

            doneTwoTimes();
        });

        user.destroy(function(err) {

            should(err).be.exactly(null);
            should.not.exist(user.username);

            should.not.exist(user.set('username', 'test'));
            should.not.exist(user.validate());
            should.not.exist(user.save());
            should.not.exist(user.destroy());

            doneTwoTimes();
        });
    });

    it('Model.destroy() with an existing Document without callback', function() {

        // Create the model
        var User = Model.generate('User', {
            username: Schema.Types.String
        });

        // Instantiate the model
        var user = new User({
            username: 'Test'
        }, false);

        // Destroy without callback
        user.destroy();
    });
});
