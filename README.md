Audit
=====

## How to use
### Code Analyse Tool
`node main.spec.js file [ignore_rule]`

`file`   file to analyse

`ignore_rule`   ∈ {`program_assignment`, `global_assignment`, `use_before_defined`, `reference_require`, `require_computed`, `required_modules`}, multiple rules which should be ignored are seperated by space

### AMD Wrapper

`node wrap.js file [not_strict]`

`not_strict`    to disable 'use strict' mode

This generates a new file with the wrapped code next to the original file.

source.js:
```javascript
var $ = require('jquery'),
    Backbone = require('backbone'),
    _;

$().ready(function () {
    'use strict';
    _ = require('underscore');
});
```

wrapped_source.js:
```javascript
define(['require', 'exports', 'module', 'jquery', 'backbone', 'underscore'], function (require, exports, module) {
    'use strict';
    var $ = require('jquery'),
        Backbone = require('backbone'),
        _;

    $().ready(function () {
        'use strict';
        _ = require('underscore');
    });
});
```