/*jslint node: true*/

'use strict';

var _ = require('underscore');

module.exports = function (audit) {

    // Create a new local scope
    audit.registerTask('createScope', function (node, options) {
        /*jslint unparam: true*/
        this.scopeChain.push(options.scope ? [].concat(options.scope) : []);
    });

    // Delete current local scope
    audit.registerTask('deleteScope', function () {
        this.scopeChain.pop();
    });

    // Add variable names to local scope
    audit.registerTask('addToLocalScope', function (item) {
        // For node type 'Identifier' only
        if (item.type === 'Identifier' && !this.isVarDefined(item.name, {local: true})) {

            // Push error to result stack
            if (this.scopeChain.length === 2) {
                this.addResult('program_assignment', {
                    name: item.name
                });
            }

            // Push node name on last scope chain item (current scope)
            this.scopeChain[this.scopeChain.length - 1].push(item.name);
        }
    });

    // Detect usage of undefined globals
    audit.registerTask('detectGlobalUsage', {
        condition: function (node, options) {
            return !options.computed || node.computed;
        },
        handle: function (item) {
            // For node type 'Identifier' only and if node name not in scope chain
            if (item.type === 'Identifier' && !this.isVarDefined(item.name)) {

                // Push error to result stack
                this.addResult('use_before_defined', {
                    name: item.name
                });
            }
        }
    });

    // Detect global assigmnets
    audit.registerTask('detectGlobalAssignment', function (item) {
        // For node type 'Identifier' only and if node name not in scope chain
        if (item.type === 'Identifier' && !this.isVarDefined(item.name)) {

            // Push error to result stack
            this.addResult('global_assignment', {
                name: item.name
            });
        }
    });

    // Detect creating references on the require method
    audit.registerTask('detectRequireReferences', function (item) {
        // For node type 'Identifier' only and name of the identifier has to be 'require'
        if (item.type === 'Identifier' && item.name === 'require') {

            // Push error to result stack
            this.addResult('reference_require', {
                name: item.name
            });
        }
    });

    // Detect require arguments are object references / computed objects
    audit.registerTask('detectRequireComputed', {
        condition: function (node) {
            return node.callee && node.callee.name === 'require';
        },
        handle: function detectRequireComputed(item) {
            if (item.type !== 'Literal') {
                // Push error to result stack
                this.addResult('require_computed', {
                    type: item.type
                });
            } else if (item.type === 'Literal' && typeof item.value !== 'string') {
                // Push error to result stack
                this.addResult('require_computed', {
                    type: 'Number'
                });
            }
        }
    });

    audit.registerTask('detectRequiredModules', {
        condition: function (node) {
            // For node type 'Identifier' only and name of the identifier has to be 'require'
            // Required Modules in AMD mode aren't considered
            return node.callee && node.callee.name === 'require' && node.arguments.length === 1;
        },
        handle: function (item) {
            // Push requiered module to module stack
            if (item.type === 'Literal') {
                this.addResult('required_modules', {
                    requires: item.value
                });
            }
        }
    });

    audit.registerTask('detectAMD', {
        condition: function (node) {
            // For node type 'Identifier' only and name of the identifier has to be 'define'
            return node.callee && node.callee.name === 'define'
        },
        handle: function (item) {
            // define shouldn't be a local variable but can be a global program variable
            if (!this.isVarDefined('define', {program_global: true})) {
                // Push AMD to module stack
                this.addResult('detected_AMD');
            }
        }
    });

    audit.registerTask('detectCommonJS', {
        condition: function (node) {
            var object, property,
                alt1, alt2, alt3;

            switch (node.type) {
                case 'MemberExpression': {
                    object = node.object;
                    property = node.property;

                    // Finds `exports.a = 1`
                    alt1 = object && object.name === 'exports';
                    // Finds `module.exports.a = 1` and `module.exports = {a: 1}`
                    alt2 = object && object.name === 'module' && property && property.name === 'exports';
                    break;
                }
                case 'CallExpression': {
                    // Finds `factory(exports, x, ...)` which is often used in UMD
                    alt3 = _.find(node.arguments, function (argument) {
                        return argument.name === 'exports';
                    });
                    break;
                }
            }

            return alt1 || alt2 || alt3;
        },
        handle: function (item) {
            var variable;

            switch (item.type) {
                case 'MemberExpression': {
                    variable = item.object.name;
                    break;
                }
                case 'CallExpression': {
                    variable = 'exports';
                    break;
                }
            }
            // `exports` and `module` respectively shouldn't be a local variable but can be a global program variable
            if (!this.isVarDefined(variable, {program_global: true})) {
                // Push AMD to module stack
                this.addResult('detected_CommonJS');
            }
        }
    });

};