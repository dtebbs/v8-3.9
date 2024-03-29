// Copyright 2012 the V8 project authors. All rights reserved.
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are
// met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above
//       copyright notice, this list of conditions and the following
//       disclaimer in the documentation and/or other materials provided
//       with the distribution.
//     * Neither the name of Google Inc. nor the names of its
//       contributors may be used to endorse or promote products derived
//       from this software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
// "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
// LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
// A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
// OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
// LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
// THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

// Flags: --allow-natives-syntax

// Test that we can inline functions containing materialized literals.

function o2(b, c) {
  return { 'b':b, 'c':c, 'y':b + c };
}

function o1(a, b, c) {
  return { 'a':a, 'x':o2(b, c) };
}

function TestObjectLiteral(a, b, c) {
  var expected = { 'a':a, 'x':{ 'b':b, 'c':c, 'y':b + c } };
  var result = o1(a, b, c);
  assertEquals(expected, result, "TestObjectLiteral");
}

TestObjectLiteral(1, 2, 3);
TestObjectLiteral(1, 2, 3);
%OptimizeFunctionOnNextCall(o1);
TestObjectLiteral(1, 2, 3);
TestObjectLiteral('a', 'b', 'c');

function f2() {
  return function(b, c) { return b + c; };
}

function f1(a, b, c) {
  return a + f2()(b, c);
}

function TestFunctionLiteral(a, b, c) {
  var expected = a + b + c;
  var result = f1(a, b, c);
  assertEquals(expected, result, "TestFunctionLiteral");
}

TestFunctionLiteral(1, 2, 3);
TestFunctionLiteral(1, 2, 3);
%OptimizeFunctionOnNextCall(f1);
TestFunctionLiteral(1, 2, 3);
TestFunctionLiteral('a', 'b', 'c');
