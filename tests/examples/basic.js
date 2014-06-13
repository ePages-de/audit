/* Do not assign any globals */
/* ------------------------- */
// Global assign of '$'
$ = require('jquery');

/* Do not access any globals except require, module, exports */
/* --------------------------------------------------------- */
// Use setTimeout
setTimeout(function () {
}, 500);

// Access document object
var body = document.body;

// Access window object
var win = window;

/* Do not reference require */
/* ------------------------ */
// Reference require in variable
var req = require;
req('path/to/module');

// Reference require in array
var arr = ['foo', 123, require, 'bar'];
arr[2]('path/to/module');

// Reference require in object
var obj = {req: require};
obj.req('path/to/module');

// Handover require reference
var callback = function (req) {
    req('path/to/module');
};
callback(require);

/* Accept string only in require call */
/* ---------------------------------- */
// Use variable to load a module
var pathToModule = 'path/to/module';
require(pathToModule);

// Use array item to load a module
var arr = ['foo', 123, 'path/to/module', 'bar'];
require(arr[2]);

// Use object to load a module
var obj = {path: 'path/to/module'};
require(obj.path);

// Use function to load a module
var getPath = function() {
    return 'path/to/module';
};
require(getPath());