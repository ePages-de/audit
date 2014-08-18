/*jslint node: true, plusplus: true, nomen: true*/

'use strict';

var audit = {
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

// Export module methods
module.exports = audit;