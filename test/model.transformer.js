/* global describe, it */
'use strict';

var should = require('should');
var Model  = require('../');
var Schema = require('bazalt-schema');

describe('Test Model.transformer() method', function() {

    it('Model.transformer({}) should return false', function() {

        var result = Model.transformer({});

        should(result).be.exactly(false);
    });

    it('Model.transformer(valid) should return true', function() {

        var result = Model.transformer({
            create(error, values, modelName, callback) {

                callback(error, this);
            },

            update(error, values, modelName, callback) {

                callback(error, this);
            },

            destroy(error, values, modelName, callback) {

                callback(error, this);
            }
        });

        should(result).be.exactly(true);
    });

    it('Model.transformer(valid + statics) should return true and allow Model.static()', function() {

        var result = Model.transformer({
            create(error, values, modelName, callback) {

                callback(error, this);
            },

            update(error, values, modelName, callback) {

                callback(error, this);
            },

            destroy(error, values, modelName, callback) {

                callback(error, this);
            },

            statics: {
                static: function() {
                    return true;
                }
            }
        });

        should(result).be.exactly(true);
        should(Model.static()).be.exactly(true);

        // Create the model
        var User = Model.generate('User', {
            username: Schema.Types.String
        });

        should(User.static()).be.exactly(true);
        should(function() {
            var user = new User();

            user.static();
        }).throw();
    });

    it('Model.transformer(valid + methods) should return true and allow this.method()', function() {

        var result = Model.transformer({
            create(error, values, modelName, callback) {

                callback(error, this);
            },

            update(error, values, modelName, callback) {

                callback(error, this);
            },

            destroy(error, values, modelName, callback) {

                callback(error, this);
            },

            methods: {
                method: function() {
                    return true;
                }
            }
        });

        should(result).be.exactly(true);
        should(function() {
            Model.method();
        }).throw();

        // Create the model
        var User = Model.generate('User', {
            username: Schema.Types.String
        });

        should(function() {

            User.method();
        }).throw();

        var user = new User();

        should(user.method()).be.exactly(true);
    });

    it('Model.transformer(valid + statics + methods) should return true and allow Model.static() and this.method()', function() {

        var result = Model.transformer({
            create(error, values, modelName, callback) {

                callback(error, this);
            },

            update(error, values, modelName, callback) {

                callback(error, this);
            },

            destroy(error, values, modelName, callback) {

                callback(error, this);
            },

            methods: {
                method: function() {
                    return true;
                }
            },

            statics: {
                static: function() {
                    return true;
                }
            }
        });

        // Check Model.static()
        should(result).be.exactly(true);
        should(Model.static()).be.exactly(true);

        // Create the model
        var User = Model.generate('User', {
            username: Schema.Types.String
        });

        should(User.static()).be.exactly(true);
        should(function() {
            var user = new User();

            user.static();
        }).throw();


        // Check this.method()
        should(result).be.exactly(true);
        should(function() {
            Model.method();
        }).throw();

        // Create the model
        var User = Model.generate('User', {
            username: Schema.Types.String
        });

        should(function() {

            User.method();
        }).throw();

        var user = new User();

        should(user.method()).be.exactly(true);
    });
});
