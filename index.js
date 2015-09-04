/**
 * Small library to operate on translation objects like those which are part of angular-translate.
 * This library is meant to be used on both client and server-side.
 * @author Henning Gerrits
 * @type {*|exports|module.exports}
 */

var Q = require('q');
var util = require('util');
var isObjectEmpty = require('is-object-empty');
var helper = require('./lib/helper');

var api = Object.create(null);

/**
 * Add key to the translation object. Non-existing objects will be created.
 * The overhanded object will be modified.
 * @param {string} key
 * @param {string} value
 * @param {object} translationObject
 * @returns {promise}
 */
api.addKey = function(key, value, translationObject){
    if(util.isNullOrUndefined(translationObject)){
        return Q.reject(new TypeError('translationObject is not an object'));
    }

    var splitted = helper.splitKey(key);
    var obj = translationObject;
    var length = splitted.length;
    var prop;

    for(var i = 0; i < length -1; i++){
        prop = obj[splitted[i]];

        if(util.isNullOrUndefined(prop)){
            obj[splitted[i]] = Object.create(null);
        } else if(util.isString(prop)){
            return Q.reject(new Error("element would be overwritten"));
        } else if(util.isObject(prop)){
            /* ignore */
        } else {
            return Q.reject(new TypeError('unexpected type'));
        }

        obj = obj[splitted[i]];
    }

    prop = obj[splitted[length-1]];

    if(util.isNullOrUndefined(prop)){
        obj[splitted[length-1]] = value;
    } else if(util.isString(prop)){
        return Q.reject(new Error("element would be overwritten"));
    } else if(util.isObject(prop)){
        return Q.reject(new Error("element would be overwritten"));
    } else {
        return Q.reject(new TypeError('unexpected type'));
    }

    return Q(translationObject);
};



/**
 * Removes the given key from the translation object. Objects that become empty due to to this
 * operation will be deleted, too.
 * @param {string} key
 * @param {object} translationObject
 * @returns {promise}
 */
api.delKey = function(key, translationObject){
    return helper.search(key, translationObject)
        .then(function(result){

            if(util.isNullOrUndefined(result)){
                return Q.reject('element does not exist');
            } else {
                var history = result.history;
                delete history[history.length-1][result.propName];

                for(var i = history.length-1; i >= 0; i--){
                    var obj = history[i];

                    var emptyObjects = Object.keys(obj).filter(function(key){
                        return util.isObject(obj[key]) && isObjectEmpty(obj[key]);
                    });

                    emptyObjects.forEach(function(key){
                        delete obj[key];
                    });
                }

                return Q(translationObject);
            }
        });
};

/**
 * Returns the associated value or null if the given key was not found.
 * @param {string} key
 * @param {object} translationObject
 * @returns {promise}
 */
api.getValue = function(key, translationObject){
    return helper.search(key, translationObject)
        .then(function(result){
            return Q(result? result.translation : null);
        });
};


/**
 * Updates the value of the given key.
 * @param {string} key
 * @param {string} value
 * @param {object} translationObject
 * @returns {promise}
 */
api.updateValue = function(key, value, translationObject){
    return api.delKey(key, translationObject)
        .then(function () {
            return api.addKey(key, value, translationObject);
        });
};

/**
 * Returns true if the given key exists in the translation object.
 * @param {string} key
 * @param {object} translationObject
 * @returns {promise}
 */
api.keyExists = function(key, translationObject){
    return api.getValue(key, translationObject)
        .then(function(translation){
            return Q(!util.isNullOrUndefined(translation));
        });
};

/**
 * Changes the key. The corresponding value will be copied.
 * @param {string} oldKey
 * @param {string} newKey
 * @param {object} translationObject
 * @returns {promise}
 */
api.changeKey = function(oldKey, newKey, translationObject){
    return api.keyExists(newKey, translationObject)
        .then(function(exists){
            if(exists){
                return Q.reject(new Error("newKey does already exist"));
            } else {
                return api.getValue(oldKey, translationObject)
                    .then(function(value){
                        return api.delKey(oldKey, translationObject)
                            .then(function(){
                                return api.addKey(newKey, value, translationObject);
                            });
                    });
            }
        });
};

module.exports = api;