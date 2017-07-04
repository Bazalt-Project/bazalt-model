'use strict';

// Function used to clone data
function clone(obj) {
    if(null === obj || 'object' !== typeof obj || true === '$__isActiveClone' in obj)
    {
        return obj;
    }

    var temp = new obj.constructor(); // changed

    for(var key in obj)
    {
        if(true === Object.prototype.hasOwnProperty.call(obj, key))
        {
            obj.$__isActiveClone = null;
            temp[key] = clone(obj[key]);
            delete obj.$__isActiveClone;
        }
    }

    return temp;
}

module.exports = clone;
