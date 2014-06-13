Audit
=====

## How to use
### Code Analyse Tool
`node main.spec.js file [rule]`

`file`   file to analyse

`rule`   ∈ {`program_assignment`, `global_assignment`, `use_before_defined`, `reference_require`, `require_computed`}, multiple rules are seperated by space

### AMD Wrapper

`node wrap.js file [not_strict]`
`not_strict`    to disable 'use strict' mode

This generates a new file with the wrapped code next to the orignial file.

source.js
```javascript
var $ = require('jquery'),
    Backbone = require('backbonde'),
    _;

$().ready(function () {
    'use strict';
    _ = require('underscore');
});
```

wrapped_source.js
```javascript
define(['require', 'exports', 'module', 'jquery', 'backbonde', 'underscore'], function (require, exports, module) {
    'use strict';
    var $ = require('jquery'),
        Backbone = require('backbonde'),
        _;

    $().ready(function () {
        'use strict';
        _ = require('underscore');
    });
});
```