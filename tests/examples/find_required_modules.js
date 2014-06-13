// Should find 'jquery', 'backbone' and 'underscore'
var $ = require('jquery'),
    Backbone = require('backbone'),
    _;

$().ready(function () {
    _ = require('underscore');
});


// Should find 'a' and 'b'
require(['a', 'b'], function (A, B) {
});