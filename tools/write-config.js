/*jslint node: true, plusplus: true, nomen: true*/
/*global */
(function () {

    'use strict';

    var grunt = require('grunt'),

        log = false,

        configData = {},

        configTemplate = '/*jslint node: true*/\nmodule.exports = {{configData}};';

    // Config create helpers
    function createScope(scope) {
        return {
            task: 'createScope',
            options: {
                scope: scope
            }
        };
    }

    function deleteScope() {
        return {
            task: 'deleteScope',
            options: {}
        };
    }

    function addToLocalScope(name, walkList) {
        return {
            task: 'addToLocalScope',
            options: {
                prop: name,
                list: !!walkList
            }
        };
    }

    function detectGlobalUsage(name, walkList, onlyIfComputed) {
        return {
            task: 'detectGlobalUsage',
            options: {
                prop: name,
                list: !!walkList,
                computed: !!onlyIfComputed
            }
        };
    }

    function detectGlobalAssignment(name) {
        return {
            task: 'detectGlobalAssignment',
            options: {
                prop: name
            }
        };
    }

    function spec(type) {
        var methods = {};

        // Define config object
        configData[type] = {};

        // Define config handle
        ['enter', 'leave'].forEach(function (method) {
            configData[type][method] = [];

            methods[method] = function () {
                var stack = configData[type][method],
                    i = 0,
                    l = arguments.length;

                for (i; i < l; i++) {
                    stack.push(arguments[i]);
                }

                return methods;
            };
        });

        return methods;
    }

    // Specify config
    spec('Program')
        .enter(
            createScope()
        )
        .leave(
            deleteScope()
        );

    spec('FunctionDeclaration')
        .enter(
            addToLocalScope('id'),
            createScope(['arguments']),
            addToLocalScope('params', true)
        )
        .leave(
            deleteScope()
        );

    spec('FunctionExpression')
        .enter(
            createScope(['arguments']),
            addToLocalScope('params', true)
        )
        .leave(
            deleteScope()
        );

    spec('VariableDeclarator')
        .enter(
            addToLocalScope('id')
        );

    spec('AssignmentExpression')
        .enter(
            detectGlobalAssignment('left'),
            detectGlobalUsage('left'),
            detectGlobalUsage('right')
        );

    spec('LogicalExpression')
        .enter(
            detectGlobalUsage('left'),
            detectGlobalUsage('right')
        );

    spec('BinaryExpression')
        .enter(
            detectGlobalUsage('left'),
            detectGlobalUsage('right')
        );

    spec('ForInStatement')
        .enter(
            detectGlobalUsage('left'),
            detectGlobalUsage('right')
        );

    spec('ConditionalExpression')
        .enter(
            detectGlobalUsage('consequent'),
            detectGlobalUsage('alternate')
        );

    spec('CallExpression')
        .enter(
            detectGlobalUsage('callee'),
            detectGlobalUsage('arguments', true)
        );

    spec('SequenceExpression')
        .enter(
            detectGlobalUsage('expressions', true)
        );

    spec('ArrayExpression')
        .enter(
            detectGlobalUsage('elements', true)
        );

    spec('ExpressionStatement')
        .enter(
            detectGlobalAssignment('expression'),
            detectGlobalUsage('expression')
        );

    spec('UpdateExpression')
        .enter(
            detectGlobalAssignment('argument'),
            detectGlobalUsage('argument')
        );

    spec('WhileStatement')
        .enter(
            detectGlobalUsage('test')
        );

    spec('DoWhileStatement')
        .enter(
            detectGlobalUsage('test')
        );

    spec('IfStatement')
        .enter(
            detectGlobalUsage('test')
        );

    spec('Property')
        .enter(
            detectGlobalUsage('value')
        );

    spec('MemberExpression')
        .enter(
            detectGlobalUsage('object'),
            detectGlobalUsage('property', false, true)
        );

    if (log) {
        console.log(JSON.stringify(configData, null, 4));
    }

    grunt.file.write(
        __dirname + '/../lib/_config.js',
        configTemplate.replace('{{configData}}', JSON.stringify(configData, null, 4)),
        'utf-8'
    );

}());