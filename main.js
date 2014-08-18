/*jslint node: true*/
'use strict';

var Test = require('./lib/test');

module.exports = {
    // Test code
    check: function (code, rules, options) {
        var test = new Test(rules, options);

        test.run(code);

        return test.resultsList.length ? {
            list: test.resultsList,
            typed: test.resultsByType
        } : true;
    },
    wrap: function (code, wrapOptions) {
        var wrap = require('./lib/wrap'),
            test = new Test({
                program_assignment: true,
                global_assignment: true,
                use_before_defined: true,
                reference_require: true,
                require_computed: true
            }, {
                global_vars: {
                    require: true
                }
            });

        test.run(code);
        return wrap(code, test.resultsByType.required_modules, wrapOptions);
    }
};