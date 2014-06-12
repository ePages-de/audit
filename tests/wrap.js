/*jslint node: true, stupid: true, nomen: true*/

var fs = require('fs'),
    leak = require('../main'),
    path = require('path'),

    environment = {
        global_vars: {
            require: true
        }
    },
    usage = function () {
        console.log('Usage:');
        console.log('------');
        console.log('wrap.spec.js file');
    },
    file, generatedCode;

if (process.argv.length < 3){
    usage();
} else {
    try {
        file = process.argv[2];
        generatedCode = leak.wrap(fs.readFileSync(__dirname + '/' + file), environment);
        if (generatedCode) {
            fs.writeFile(__dirname + '/' + path.dirname(file) + '/wrapped_' + path.basename(file), generatedCode);
        }
    } catch (err) {
        console.log('An error occured while wrapping:\n', err, '\n');
        usage();
    }
}
