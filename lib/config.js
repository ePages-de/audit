/*jslint node: true*/

'use strict';

module.exports = function (audit) {

    audit.configureTraverse("Program", {
        "enter": [
            {
                "task": "createScope",
                "options": {}
            }
        ],
        "leave": [
            {
                "task": "deleteScope",
                "options": {}
            }
        ]
    });

    audit.configureTraverse("FunctionDeclaration", {
        "enter": [
            {
                "task": "addToLocalScope",
                "options": {
                    "prop": "id",
                    "list": false
                }
            },
            {
                "task": "createScope",
                "options": {
                    "scope": [
                        "arguments"
                    ]
                }
            },
            {
                "task": "addToLocalScope",
                "options": {
                    "prop": "params",
                    "list": true
                }
            }
        ],
        "leave": [
            {
                "task": "deleteScope",
                "options": {}
            }
        ]
    });

    audit.configureTraverse("FunctionExpression", {
        "enter": [
            {
                "task": "createScope",
                "options": {
                    "scope": [
                        "arguments"
                    ]
                }
            },
            {
                "task": "addToLocalScope",
                "options": {
                    "prop": "params",
                    "list": true
                }
            }
        ],
        "leave": [
            {
                "task": "deleteScope",
                "options": {}
            }
        ]
    });

    audit.configureTraverse("VariableDeclarator", {
        "enter": [
            {
                "task": "addToLocalScope",
                "options": {
                    "prop": "id",
                    "list": false
                }
            },
            {
                "task": "detectRequireReferences",
                "options": {
                    "prop": "init",
                    "list": false
                }
            }
        ]
    });

    audit.configureTraverse("AssignmentExpression", {
        "enter": [
            {
                "task": "detectGlobalAssignment",
                "options": {
                    "prop": "left"
                }
            },
            {
                "task": "detectGlobalUsage",
                "options": {
                    "prop": "left",
                    "list": false,
                    "computed": false
                }
            },
            {
                "task": "detectGlobalUsage",
                "options": {
                    "prop": "right",
                    "list": false,
                    "computed": false
                }
            },
            {
                "task": "detectRequireReferences",
                "options": {
                    "prop": "right",
                    "list": false
                }
            }
        ]
    });

    audit.configureTraverse("LogicalExpression", {
        "enter": [
            {
                "task": "detectGlobalUsage",
                "options": {
                    "prop": "left",
                    "list": false,
                    "computed": false
                }
            },
            {
                "task": "detectGlobalUsage",
                "options": {
                    "prop": "right",
                    "list": false,
                    "computed": false
                }
            }
        ]
    });

    audit.configureTraverse("BinaryExpression", {
        "enter": [
            {
                "task": "detectGlobalUsage",
                "options": {
                    "prop": "left",
                    "list": false,
                    "computed": false
                }
            },
            {
                "task": "detectGlobalUsage",
                "options": {
                    "prop": "right",
                    "list": false,
                    "computed": false
                }
            }
        ]
    });

    audit.configureTraverse("ForInStatement", {
        "enter": [
            {
                "task": "detectGlobalUsage",
                "options": {
                    "prop": "left",
                    "list": false,
                    "computed": false
                }
            },
            {
                "task": "detectGlobalUsage",
                "options": {
                    "prop": "right",
                    "list": false,
                    "computed": false
                }
            }
        ]
    });

    audit.configureTraverse("ConditionalExpression", {
        "enter": [
            {
                "task": "detectGlobalUsage",
                "options": {
                    "prop": "consequent",
                    "list": false,
                    "computed": false
                }
            },
            {
                "task": "detectGlobalUsage",
                "options": {
                    "prop": "alternate",
                    "list": false,
                    "computed": false
                }
            }
        ]
    });

    audit.configureTraverse("CallExpression", {
        "enter": [
            {
                "task": "detectGlobalUsage",
                "options": {
                    "prop": "callee",
                    "list": false,
                    "computed": false
                }
            },
            {
                "task": "detectGlobalUsage",
                "options": {
                    "prop": "arguments",
                    "list": true,
                    "computed": false
                }
            },
            {
                "task": "detectRequireReferences",
                "options": {
                    "prop": "arguments",
                    "list": true
                }
            },
            {
                "task": "detectRequireComputed",
                "options": {
                    "prop": "arguments",
                    "list": true
                }
            },
            {
                "task": "detectRequiredModules",
                "options": {
                    "prop": "arguments",
                    "list": true
                }
            },
            {
                "task": "detectAMD",
                "options": {
                    "list": false
                }
            }
        ]
    });

    audit.configureTraverse("SequenceExpression", {
        "enter": [
            {
                "task": "detectGlobalUsage",
                "options": {
                    "prop": "expressions",
                    "list": true,
                    "computed": false
                }
            },
            {
                "task": "detectRequireReferences",
                "options": {
                    "prop": "expressions",
                    "list": true
                }
            }
        ]
    });

    audit.configureTraverse("ArrayExpression", {
        "enter": [
            {
                "task": "detectGlobalUsage",
                "options": {
                    "prop": "elements",
                    "list": true,
                    "computed": false
                }
            },
            {
                "task": "detectRequireReferences",
                "options": {
                    "prop": "elements",
                    "list": true
                }
            }
        ]
    });

    audit.configureTraverse("ExpressionStatement", {
        "enter": [
            {
                "task": "detectGlobalAssignment",
                "options": {
                    "prop": "expression"
                }
            },
            {
                "task": "detectGlobalUsage",
                "options": {
                    "prop": "expression",
                    "list": false,
                    "computed": false
                }
            }
        ]
    });

    audit.configureTraverse("UpdateExpression", {
        "enter": [
            {
                "task": "detectGlobalAssignment",
                "options": {
                    "prop": "argument"
                }
            },
            {
                "task": "detectGlobalUsage",
                "options": {
                    "prop": "argument",
                    "list": false,
                    "computed": false
                }
            }
        ]
    });

    audit.configureTraverse("WhileStatement", {
        "enter": [
            {
                "task": "detectGlobalUsage",
                "options": {
                    "prop": "test",
                    "list": false,
                    "computed": false
                }
            }
        ]
    });

    audit.configureTraverse("DoWhileStatement", {
        "enter": [
            {
                "task": "detectGlobalUsage",
                "options": {
                    "prop": "test",
                    "list": false,
                    "computed": false
                }
            }
        ]
    });

    audit.configureTraverse("IfStatement", {
        "enter": [
            {
                "task": "detectGlobalUsage",
                "options": {
                    "prop": "test",
                    "list": false,
                    "computed": false
                }
            }
        ]
    });

    audit.configureTraverse("Property", {
        "enter": [
            {
                "task": "detectGlobalUsage",
                "options": {
                    "prop": "value",
                    "list": false,
                    "computed": false
                }
            },
            {
                "task": "detectRequireReferences",
                "options": {
                    "prop": "value",
                    "list": false
                }
            }
        ]
    });

    audit.configureTraverse("MemberExpression", {
        "enter": [
            {
                "task": "detectGlobalUsage",
                "options": {
                    "prop": "object",
                    "list": false,
                    "computed": false
                }
            },
            {
                "task": "detectGlobalUsage",
                "options": {
                    "prop": "property",
                    "list": false,
                    "computed": true
                }
            },
            {
                "task": "detectCommonJS",
                "options": {
                    "list": false
                }
            }
        ]
    });

};