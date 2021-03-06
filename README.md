Shift Traverser
==============


## About

This is a fork and update of Constellation's shift-traverse. Nothing has changed aside from it being 
modernized and updated for Shift 2018.

This module provides traversal functionality similar to [estraverse](https://github.com/estools/estraverse) for a [Shift format](https://github.com/shapesecurity/shift-spec) AST.


<!--
## Status

[Stable](http://nodejs.org/api/documentation.html#documentation_stability_index).
-->

## Installation

```sh
npm install shift-traverser
```


## Usage

### traverse
```js
import {traverse} from "shift-traverser"

traverse(tree, {
    enter(node) {
        console.log(`entering ${node.type}`);
    },

    leave(node) {
        console.log(`leaving ${node.type}`);
    }
});
```

### replace

```js
import parse from 'shift-parser'
import codegen from "shift-codegen";
import { LiteralStringExpression } from "shift-ast";
import { replace, Syntax } from '../'

let code = `
function test() {
    console.log("HELLO WORLD");
}
`;
let tree = parse(code);
let transformed = replace(tree, {
    enter(node, parent) {
        if (node.type === Syntax.LiteralStringExpression) {
            return new LiteralStringExpression('ご注文はうさぎですか？');
        }
    }
});
assert(codegen(transformed) === `function test(){console.log("ご注文はうさぎですか？")}`);
```

### License

Copyright (C) 2012-2014 [Yusuke Suzuki](http://github.com/Constellation)
 (twitter: [@Constellation](http://twitter.com/Constellation)) and other contributors.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright
    notice, this list of conditions and the following disclaimer.

  * Redistributions in binary form must reproduce the above copyright
    notice, this list of conditions and the following disclaimer in the
    documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
