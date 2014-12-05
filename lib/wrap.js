/*jslint node: true*/
'use strict';

var esprima = require('esprima'),
    escodegen = require('escodegen'),
    _ = require('underscore');

module.exports = function (code, requiredModules, opts) {
    // Build the wrapper with the desired modules
    var modules = [],
        moduleString,
        wrapperString,
        wrapper,
        functionBody;

    // If other modules are required.
    if (requiredModules) {
        requiredModules.forEach(function (module) {
            // Concatenate all required module names
            modules.push('\'' + module.data.requires + '\'');
        });
        moduleString = ',' + modules.join(', ');
    } else {
        moduleString = '';
    }

    wrapperString = 'define([\'require\', \'exports\', \'module\'' + moduleString + '], function (require, exports, module) {});';

    try {
        // Build the AST of the actual code
        functionBody = esprima.parse(code).body;

        //Prepend globals if needed
        if (opts && opts.globals) {
            var globalsString = '';

            opts.globals.forEach(function (variable) {
                Object.keys(variable).forEach(function (name) {
                    globalsString += 'var ' + name + ' = ' + variable[name]  + ';';
                });
            });

            // Prepend our global variables
            functionBody.unshift(esprima.parse(globalsString));
        }

        // Set 'use strict' as default mode when not explicitly disabled
        if (!opts || opts.use_strict) {
            var alreadythere = _.find(functionBody, function (node) {
                return node.type === 'ExpressionStatement' && node.expression.value === 'use strict';
            });

            // Proof if 'use strict' mode is already used in the global context
            if (!alreadythere) {
                functionBody.unshift({
                    type: 'ExpressionStatement',
                    expression: {
                        type: 'Literal',
                        value: 'use strict',
                        raw: '\'use strict\''
                    }
                });
            }
        }
        // Build the wrapper's and it's content's AST
        wrapper = esprima.parse(wrapperString);

        // Mount the code which should be wrapped, inside the wrapper
        wrapper.body[0].expression.arguments[1].body.body = functionBody;

        // Generate the whole code from the AST
        return escodegen.generate(wrapper);
    } catch (err) {
        console.log('Something went wrong while parsing and code generating', err);
    }
};
