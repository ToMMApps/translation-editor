var Q = require('q');

module.exports.splitKey = function(key){
    return key.split('.');
};

/**
 * Traverses the given translationObject to find the given Key.
 * @param {string} key
 * @param {object} translationObject
 * @returns {promise} Resolves to an object with the following properties:
 *  - translation: The actual value that is associated to the overhanded key.
 *  - history: Array of properties that were traversed to find the key.
 *  - propName Short name of the property. For Example: If key is named 'TEST.KEY', the short name
 *  would be KEY.
 *  Resolves to null if the given key could not be found.
 */
module.exports.search = function(key, translationObject){
    var splitted = module.exports.splitKey(key);
    var obj = translationObject;
    var length = splitted.length;
    var prop;
    var history = [translationObject];

    for(var i = 0; i < length -1; i++){
        prop = obj[splitted[i]];

        if(!prop){
            return Q();
        } else if(typeof prop === 'string'){
            return Q();
        } else if(typeof prop === 'object'){
            /* ignore */
        } else {
            return Q.reject(new TypeError('unexpected type'));
        }

        obj = prop;
        history.push(prop);
    }

    prop = obj[splitted[length-1]];

    if(!prop){
        return Q(null);
    } else if(typeof prop === 'string'){
        return Q({translation: obj[splitted[length-1]], history: history, propName: splitted[length-1]});
    } else if(typeof prop === 'object'){
        return Q(null);
    } else {
        return Q.reject(new TypeError('unexpected type'));
    }
};