exports.a = 1;

module.exports.b = 2;

module.exports = {
    a: 5,
    b: 7,
    c: 12
};
var module;
var c = function () {
    var exports,
        module;

    // This isn't found
    exports.b = 3;
    module.exports = {};
};