/*jslint node: true, plusplus: true, nomen: true*/

'use strict';

var audit = require('./audit'),
    _ = require('underscore'),
    esprima = require('esprima'),
    estraverse = require('estraverse');

// Test class
function Test(rules, options) {
    this.taskconf = audit._traverse;
    this.tasks = audit._tasks;

    this.rules = _.extend({
        program_assignment: false,
        global_assignment: false,
        use_before_defined: false,
        reference_require: false,
        require_computed: false,
        required_modules: false
    }, rules);

    this.options = _.extend({
        global_vars: {}
    }, options);
}

// Define methods for Test class
Test.prototype = {
    // Initialize
    init: function () {
        var varname;

        this.resultsByType = {};
        this.resultsList = [];

        this.scopeChain = [
            []
        ];

        // Add whitelisted variable names to the pre defined global scope
        for (varname in this.options.global_vars) {
            if (this.options.global_vars.hasOwnProperty(varname)) {
                this.scopeChain[0].push(varname);
            }
        }
    },

    // Run specified tasks to check code
    run: function (code) {
        var that = this;

        // Init test class
        this.init();

        // Walk traversal to run tasks
        estraverse.traverse(esprima.parse(code, {loc: true}), {
            // Handle on enter a node
            enter: function (node) {

                // Check whether tasks for current node type are specified
                if (that.taskconf[node.type]) {
                    that.taskconf[node.type].enter.forEach(function (conf) {

                        // Check whether the specified task exists
                        if (that.tasks[conf.task]) {
                            that.tasks[conf.task].call(that, node, conf.options);
                        }
                    });
                }
            },

            // Handle on leave a node
            leave: function (node) {

                // Check whether tasks for current node type are specified
                if (that.taskconf[node.type]) {
                    that.taskconf[node.type].leave.forEach(function (conf) {

                        // Check whether the specified task exists
                        if (that.tasks[conf.task]) {
                            that.tasks[conf.task].call(that, node, conf.options);
                        }
                    });
                }
            }
        });
    },

    // Detect whether a variable name exists in scope chain
    isVarDefined: function (varname, option) {
        var i = this.scopeChain.length - 1,
            l = 0,
            scope;

            if (option) {
                if (option.local) {
                    l = this.scopeChain.length - 2;
                } else if (option.program_global) {
                    l = 1;
                }
            }

        for (i; i >= l; i--) {
            scope = this.scopeChain[i];

            if (scope.indexOf(varname) !== -1) {
                return true;
            }
        }

        return false;
    },

    // Add result with namespace by option name
    addResult: function (name, data) {
        var result;

        // Set error if option is not explicitly allowed
        if (!this.rules[name]) {
            if (!this.resultsByType[name]) {
                this.resultsByType[name] = [];
            }

            result = {
                type: name,
                loc: this.currentNode.loc,
                scope: [].concat(this.scopeChain),
                data: data
            };

            this.resultsByType[name].push(result);
            this.resultsList.push(result);
        }
    }
};

module.exports = Test;