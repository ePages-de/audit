/*jslint node: true, stupid: true, nomen: true*/
'use strict';

var fs = require('fs'),
    leak = require('../main'),
    path = require('path'),

    rules = {},
    environment = {
        global_vars: {
            module: true,
            exports: true,
            define: true,
            require: true
        }
    },
    result;

function usage () {
    console.log('Usage:');
    console.log('------');
    console.log(path.basename(process.argv[1]) + ' file [rule1 rule2 ruleX]\n');
    console.log('rules which can be ignored:');
    console.log('program_assignment, global_assignment, use_before_defined, reference_require, require_computed');
}


for (var i=3; i < process.argv.length; i++) {
    rules[process.argv[i]] = true;
}

if (process.argv.length < 3){
    usage();
} else {
    try {
        result = leak.check(fs.readFileSync(__dirname + '/' + process.argv[2]), rules, environment);

        console.log('leaks:');
        console.log('------------');
        console.log(JSON.stringify(result.list, null, 4));
        console.log('------------');
        console.log(JSON.stringify(result.typed, null, 4));
        console.log('------------');
        for (var rule in result.typed) {
            console.log(rule + ': ' + result.typed[rule].length);
        }
    } catch (err) {
        console.log('An error occured:\n', err, '\n');
        usage();
    }
}
