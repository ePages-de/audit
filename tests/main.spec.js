/*jslint node: true, stupid: true, nomen: true*/

var fs = require('fs'),
    leak = require('../main'),

    rules = {},
    environment = {
        global_vars: {
            require: true
        }
    },
    usage = function () {
        console.log('Usage:');
        console.log('------');
        console.log(path.basename(process.argv[1]) + ' file [rule1 rule2 ruleX]\n');
        console.log('rules which can be ignored:');
        console.log('program_assignment, global_assignment, use_before_defined, reference_require, require_computed');
    };

for (var i=3; i < process.argv.length; i++) {
    rules[process.argv[i]] = true;
}

if (process.argv.length < 3){
    usage();
} else {
    try {
        leak.check(fs.readFileSync(__dirname + '/' + process.argv[2]), rules, environment);
    } catch (err) {
        console.log('An error occured:\n', err, '\n');
        usage();
    }
}
