/*jslint node: true, stupid: true, nomen: true*/
'use strict';

var fs = require('fs'),
    leak = require('../main'),
    path = require('path'),

    rules = {},
    environment = {
        global_vars: {
            // module: true,
            // exports: true,
            require: true
        }
    },
    result, rule;

function usage () {
    console.log('Usage:');
    console.log('------');
    console.log(path.basename(process.argv[1]) + ' file\n');
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
        for (rule in result.typed) {
            console.log(rule + ': ' + result.typed[rule].length);
        }
    } catch (err) {
        console.log('An error occured:\n', err, '\n');
        usage();
    }
}
