/*jslint node: true, plusplus: true, nomen: true*/
/*global */

'use strict';

var _ = require('underscore'),
    esprima = require('esprima'),
    estraverse = require('estraverse'),

    audit = {
        // Private storage of traverse configuration
        _traverse: {},

        // Privat storage for tasks
        _tasks: {},

        // Private storage for list of global vars in different environments
        _env_vars: {},

        // Get whitelist of 'ecma' identifiers
        vars: function (environment) {
            return audit._env_vars[environment] ? Object.create(audit._env_vars[environment]) : {};
        },

        // Handle to register tasks
        registerTask: function (task, conf) {
            var condition = conf.condition || function () {
                    return true;
                },
                callback = typeof conf === 'function' ? conf : conf.handle;

            audit._tasks[task] = function (node, options) {
                // Define item callback to keep the options argument
                function itemCallback(item) {
                    //
                    this.currentNode = item;
                    callback.call(this, item, options);
                }

                if (condition(node, options)) {
                    if (options.prop) {
                        // Run on property item
                        if (node[options.prop]) {

                            // Single or list property item
                            if (options.list) {
                                node[options.prop].forEach(itemCallback, this);
                            } else {
                                itemCallback.call(this, node[options.prop]);
                            }
                        }
                    } else {
                        //
                        this.currentNode = node;
                        // Run on node
                        callback.call(this, node, options);
                    }
                }
            };
        },

        // Handle to configure the AST traverse
        configureTraverse: function (nodeType, traverse) {
            var conf = audit._traverse[nodeType];

            // Create config if not exists for this node type
            if (!conf) {
                conf = audit._traverse[nodeType] = {
                    enter: [],
                    leave: []
                };
            }

            // Add task configs on enter node
            if (traverse.enter) {
                conf.enter = conf.enter.concat(traverse.enter);
            }

            // Add task configs on leave node
            if (traverse.leave) {
                conf.leave = conf.leave.concat(traverse.leave);
            }
        }
    };

// Initialize tasks and task configuration
audit._global_vars = require('./vars');
require('./config')(audit);
require('./tasks')(audit);

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
    isVarDefined: function (varname, local) {
        var i = this.scopeChain.length - 1,
            l = local ? this.scopeChain.length - 2 : 0,
            scope;

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

// Export module methods
module.exports = {
    // Test code
    check: function (code, rules, options) {
        var test = new Test(rules, options);

        test.run(code);

        (function () {
            // DEBUG
            /*jslint forin: true*/

            var rule;

            console.log('leaks:');
            console.log('------------');
            console.log(JSON.stringify(test.resultsList, null, 4));
            console.log('------------');
            console.log(JSON.stringify(test.resultsByType, null, 4));
            console.log('------------');
            for (rule in test.resultsByType) {
                console.log(rule + ': ' + test.resultsByType[rule].length);
            }
        }());

        return test.resultsList.length ? {
            list: test.resultsList,
            typed: test.resultsByType
        } : true;
    }
};