'use strict';

// Load requirements
var EventEmitter = require('events').EventEmitter;
var Schema       = require('bazalt-schema');

// Local requirements
var clone = require('./clone');

// Class based EventEmitter
class ModelEmitter extends EventEmitter {}

const EmitterMethods = [
    'addListener',
    'eventNames',
    'emit'
    'getMaxListeners',
    'listenerCount',
    'listeners',
    'on',
    'once',
    'prependListener',
    'prependOnceListener',
    'removeAllListeners',
    'removeListener',
    'setMaxListeners'
];

// Define the model class
class Model extends EventEmitter {

    // Define allowed Events
    static get Events() {
        return {
            Created:   'created',
            Changed:   'changed',
            Updated:   'updated',
            Destroyed: 'destroyed'
        };
    }

    // Define allowed Events List
    static get EventsList() {
        return [
            Model.Events.Created,
            Model.Events.Changed,
            Model.Events.Updated,
            Model.Events.Destroyed
        ];
    }

    // The constructor of the new model
    constructor(values, isNew = true) {
        super();

        // Abort if no schema
        if('undefined' === typeof this.$__schema)
        {
            return;
        }

        // And each fields of the schema
        let schema = this.$__schema;

        // Save data
        this.$__identifiers = schema.identifiers || ['id'];
        this.$__values      = clone(values || {});
        this.$__previous    = clone(values || {});
        this.$__changed     = {};
        this.$__isNew       = isNew;
        this.$__isDeleted   = false;

        // Generate a property for each field
        for(let field of schema.fields)
        {
            let value = schema.path(field).default();

            // Define the descriptor of the property field
            let descriptor = {
                enumerable: true,
                get: this.get.bind(this, field),
                set: this.set.bind(this, field)
            };

            // Check if there is a default value
            if(true === isNew && 'undefined' !== typeof value)
            {
                // If there is no value and the 
                if(!this.$__values[field] && 'function' === typeof value)
                {
                    value = value();
                }

                this.$__values[field] = this.$__values[field] || value;
            }

            Object.defineProperty(this, field, descriptor);
        }
    }

    get(key) {
        if(true === this.$__isDeleted)
        {
            return;
        }

        return this.$__values[key];
    }

    set(key, value) {
        if(true === this.$__isDeleted)
        {
            return;
        }

        this.$__changed[key] = value !== this.$__previous[key];
        this.$__values[key]  = value;

        // If changed, notify the change
        if(true === this.$__changed[key])
        {
            this.emit(Model.Events.Changed, key, value);
        }
    }

    validate() {
        if(true === this.$__isDeleted)
        {
            return;
        }

        var values = clone(this.$__values);

        return this.$__schema.validate(values);
    }

    save(callback) {
        if(true === this.$__isDeleted)
        {
            return;
        }

        // Validate the model
        var error = this.validate();

        if(error)
        {
            if('function' === typeof callback)
            {
                callback(error, this);
            }

            return;
        }

        // All seems good
        let self      = this,
            values    = this.$__values,
            modelName = this.modelName;

        var done  = function(error, data) {
            // Get the name of the event
            let event = self.$__isNew ? Model.Events.Created : Model.Events.Updated;
            
            if(!error)
            {
                // Set to false
                self.$__isNew = false;

                let fields = self.$__schema.fields;

                // Extract the value each values
                for(let index in fields)
                {
                    let property = fields[index]; 

                    // Change the value in the model
                    self.set(property, data.get(property));
                }
            }

            self.emit(event, error, self);
            model.emit(event, error, self);

            if('function' === typeof callback)
            {
                callback(error, self);
            }
        };

        if(true === this.$__isNew)
        {
            this.$__transformer.create.call(this, error, values, modelName, done);
        }
        else
        {
            this.$__transformer.update.call(this, error, values, modelName, done);
        }
    }

    destroy(callback) {
        if(true === this.$__isDeleted)
        {
            return;
        }

        let self      = this,
            error     = null,
            values    = this.$__values,
            modelName = this.modelName,
            done      = function(error) {
                if(!error)
                {
                    // Reset values
                    self.$__isDeleted = true;
                }

                self.emit(Model.Events.Destroyed, error, self);
                model.emit(Model.Events.Destroyed, error, self);

                if('function' === typeof callback)
                {
                    callback(error, model);
                }
            };

        this.$__transformer.destroy.call(this, error, values, modelName, done);
    }

    // Create a new instance of model
    static new(values, isNew = true) {
        // Return an instance of Model
        return new this(values, isNew);
    }

    // Generate a new model
    static generate(modelName, schema) {
        // Check for JSON Schema
        if('string' === typeof schema)
        {
            schema = Schema.fromJSON(schema);
        }
        else if(false === schema instanceof Schema)
        {
            schema = new Schema(schema);
        }

        let classes = {};
            
        classes[modelName] = class extends Model {
            constructor(values, isNew) {
                super(values, isNew);
            }
        };

        let model = classes[modelName];

        // Store model information
        model.modelName = model.prototype.modelName = modelName;
        model.$__schema = model.prototype.$__schema = schema;
        
        // Instanciate the Model Emitter
        model.$__emitter = new ModelEmitter();

        for(let method of EmitterMethods) {

            model[method] = model.$__emitter[method].bind(model.$__emitter);
        }

        // Create a pre-bind class
        return model;
    }

    static addMethod(instanceName, instanceFunction) {
        // Check the type to be sure it's a function
        if(
            'function'  === typeof instanceFunction &&
            'undefined' === typeof Model.prototype[instanceName]
        ) {
            Model.prototype[instanceName] = instanceFunction;
        }
    }

    static methods(methods) {
        // Check for instances functions
        for(let instanceName in methods) {

            // Store the function
            Model.addMethod(instanceName, methods[instanceName]);
        }
    }

    static addStatic(staticName, staticFunction) {
        // Check the type to be sure it's a function
        if(
            'function'  === typeof staticFunction &&
            'undefined' === typeof Model[staticName]
        ) {
            Model[staticName] = staticFunction;
        }
    }

    static statics(statics) {
        // Check for static functions
        for(let staticName in statics) {

            // Store the function
            Model.addStatic(staticName, statics[staticName]);
        }
    }

    static transformer(transformer) {
        // Check if this is function
        if(
            'object'   === typeof transformer        &&
            'function' === typeof transformer.create &&
            'function' === typeof transformer.update &&
            'function' === typeof transformer.destroy
        ) {
            // Store the transformer
            Model.$__transformer = Model.prototype.$__transformer = transformer;

            // Register statics methods
            Model.statics(transformer.statics);

            // Register instance methods
            Model.methods(transformer.methods);

            return true;
        }

        return false;
    }
}

// Set default callbacks
Model.transformer({
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

// Export the Model class
module.exports = Model;