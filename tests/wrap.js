/*jslint node: true, stupid: true, nomen: true*/

var fs = require('fs'),
    leak = require('../main'),
    path = require('path'),

    usage = function () {
        console.log('Usage:');
        console.log('------');
        console.log(path.basename(process.argv[1]) + ' file [not_strict]\n');
        console.log('not_strict\tto disable `use_strict` mode');
    },
    file, generatedCode, not_strict;

if (process.argv.length < 3){
    usage();
} else {
    try {
        file = process.argv[2];
        if (process.argv[3] === 'not_strict') {
            not_strict = {
                use_strict: 'false'
            };
        }
        generatedCode = leak.wrap(fs.readFileSync(__dirname + '/' + file), not_strict);
        if (generatedCode) {
            fs.writeFile(__dirname + '/' + path.dirname(file) + '/wrapped_' + path.basename(file), generatedCode);
        }
    } catch (err) {
        console.log('An error occured while wrapping:\n', err, '\n');
        usage();
    }
}
