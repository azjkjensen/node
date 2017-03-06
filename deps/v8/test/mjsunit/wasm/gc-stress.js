// Copyright 2016 the V8 project authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Flags: --expose-wasm  --stress-gc

load("test/mjsunit/wasm/wasm-constants.js");
load("test/mjsunit/wasm/wasm-module-builder.js");

function run(f) {
  var builder = new WasmModuleBuilder();
  builder.addImport("f", kSig_i_i);
  builder.addFunction("main", kSig_i_i)
    .addBody([
      kExprGetLocal, 0,
      kExprCallFunction, 0])
    .exportAs("main");

  print("module");
  var module = new WebAssembly.Module(builder.toBuffer());

  for (var i = 0; i < 10; i++) {
    print("  instance " + i);
    var instance = new WebAssembly.Instance(module, {f: f});
    var g = instance.exports.main;
    for (var j = 0; j < 10; j++) {
      assertEquals(f(j), g(j));
    }
  }
}

(function test() {
  for (var i = 0; i < 100; i++) {
    run(x => (x + 19));
    run(x => (x - 18));
  }
})();