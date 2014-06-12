/*jslint node: true, stupid: true, nomen: true*/

var fs = require('fs'),
    leak = require('../main'),

    rules = {
        program_assignment: true,
        require_computed: true
    },
    environment = {
        global_vars: {
            require: true
        }
    };

leak.check(fs.readFileSync(__dirname + '/main.example-3.js'), rules, environment);