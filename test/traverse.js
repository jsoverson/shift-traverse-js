/*
  Copyright (C) 2014 Yusuke Suzuki <utatane.tea@gmail.com>

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
*/

import * as fs from 'fs'
import * as assert from 'power-assert'
import { parseScript, parseModule } from 'shift-parser'
import Shift from 'shift-spec'
import { reduce, adapt, PlusReducer } from 'shift-reducer';
import { traverse } from '../'

function officialCount(tree) {
    let reducer = adapt(data => data + 1, new PlusReducer);
    return reduce(reducer, tree);
}
  

describe('traverse', () => {
    it('enter', () => {
        let code = `
        function test() {
            console.log("HELLO WORLD");
        }
        `;
        let tree = parseScript(code);
        let result = [];
        traverse(tree, {
            enter(node) {
                result.push(node.type);
            }
        });
        assert.deepEqual(result, [
            'Script',
            'FunctionDeclaration',
            'BindingIdentifier',
            'FormalParameters',
            'FunctionBody',
            'ExpressionStatement',
            'CallExpression',
            'StaticMemberExpression',
            'IdentifierExpression',
            'LiteralStringExpression'
        ]);
    });

    it('leave', () => {
        let code = `
        function test() {
            console.log("HELLO WORLD");
        }
        `;
        let tree = parseScript(code);
        let result = [];
        traverse(tree, {
            leave(node) {
                result.push(node.type);
            }
        });
        assert.deepEqual(result, [
            'BindingIdentifier',
            'FormalParameters',
            'IdentifierExpression',
            'StaticMemberExpression',
            'LiteralStringExpression',
            'CallExpression',
            'ExpressionStatement',
            'FunctionBody',
            'FunctionDeclaration',
            'Script'
        ]);
    });

    it('both', () => {
        let code = `
        function test() {
            console.log("HELLO WORLD");
        }
        `;
        let tree = parseScript(code);
        let result = [];
        traverse(tree, {
            enter(node) {
                result.push(`enter:${node.type}`);
            },

            leave(node) {
                result.push(`leave:${node.type}`);
            }
        });
        assert.deepEqual(result, [
            'enter:Script',
            'enter:FunctionDeclaration',
            'enter:BindingIdentifier',
            'leave:BindingIdentifier',
            'enter:FormalParameters',
            'leave:FormalParameters',
            'enter:FunctionBody',
            'enter:ExpressionStatement',
            'enter:CallExpression',
            'enter:StaticMemberExpression',
            'enter:IdentifierExpression',
            'leave:IdentifierExpression',
            'leave:StaticMemberExpression',
            'enter:LiteralStringExpression',
            'leave:LiteralStringExpression',
            'leave:CallExpression',
            'leave:ExpressionStatement',
            'leave:FunctionBody',
            'leave:FunctionDeclaration',
            'leave:Script'
        ]);
    });

    it('should traverse es2015 modules', () => {
        let code = fs.readFileSync(require.resolve('everything.js/es2015-module'));
        let tree = parseModule(code.toString());
        let result = [];

        traverse(tree, {
            enter(node) {
                result.push(node.type);
            }
        });

        let reducerCount = officialCount(tree);
        assert(result.length === reducerCount);
    });

    it('should traverse es2015 scripts', () => {
        let code = fs.readFileSync(require.resolve('everything.js/es2015-script'));
        let tree = parseScript(code.toString());
        let result = [];
        traverse(tree, {
            enter(node) {
                result.push(node.type);
            }
        });
        
        let reducerCount = officialCount(tree);
        assert(result.length === reducerCount);
    });

    it('should parse es2016-es2018 source', () => {
        let src = `
        async function a( // https://github.com/tc39/ecmascript-asyncawait
            param, // https://github.com/tc39/proposal-trailing-function-commas
        ) {
            e **= g ** 2; // https://github.com/tc39/proposal-exponentiation-operator
            await f(); // https://github.com/tc39/ecmascript-asyncawait
        }
      `;
      let tree = parseScript(src);
      let result = [];
      traverse(tree, {
          enter(node) {
              result.push(node.type);
          }
      });
      
      let reducerCount = officialCount(tree);
      assert(result.length === reducerCount);
    });

});


function gatherNodes(src) {
    let tree = parseScript(src);
    let result = [];
    traverse(tree, {
        enter(node) {
            result.push(node.type);
        }
    });
    return result;
}

/* vim: set sw=4 ts=4 et tw=80 : */
