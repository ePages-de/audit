exports.a = 1;

module.exports.b = 2;

module.exports = {
    a: 5,
    b: 7,
    c: 12
};

var c = function () {
    var exports,
        module;

    // This isn't found
    exports.b = 3;
    module.exports = {};
};


// Using CommonJS, AMD or browser globals to create a module
(function ( root, factory ) {
    if ( typeof exports === 'object' ) {
        // CommonJS
        factory( exports, require('b') );
    } else if ( typeof define === 'function' && define.amd ) {
        // AMD. Register as an anonymous module.
        define( ['exports', 'b'], factory);
    } else {
        // Browser globals
        factory( (root.commonJsStrict = {}), root.b );
    }
}(this, function ( exports, b ) {
    //use b in some fashion.

    // attach properties to the exports object to define
    // the exported module properties.
    exports.action = function () {};
}));