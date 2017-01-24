var assert = require('assert');

var safeStringify = require('../safe-stringify');

describe('safeStringify', function() {
  it("handles objects with no circular deps", function () {
    assert.equal(safeStringify({}), "{}");
    assert.equal(safeStringify([]), "[]");
    assert.equal(safeStringify([1, 2, 3]), "[1,2,3]");
    assert.equal(safeStringify("jeeva"), '"jeeva"');
    assert.equal(safeStringify(1.1), "1.1");
    assert.equal(safeStringify(false), "false");
    assert.equal(safeStringify({a: {b: "c"}}), '{"a":{"b":"c"}}');
  });

  it("doesn't crash with circular deps", function () {
    var x = {}
    x.x = x;
    assert.equal(safeStringify(x), '{"x":"<circular>"}');

    const y = [x];
    x.y = y
    assert.equal(safeStringify(x), '{"x":"<circular>","y":["<circular>"]}');
  });

  it("doesn't treat repeated strings or numbers as a circular dep", function () {
    assert.equal(safeStringify([
        {"a": "b"},
        {"a": "b"},
    ]), '[{"a":"b"},{"a":"b"}]');

    assert.equal(safeStringify([
        {"a": 1},
        {"a": 1},
    ]), '[{"a":1},{"a":1}]');
  });

  it("Handles errors in toJSON", function () {
    // Finally, check errors in toString are handled
    function TestObj() { }
    TestObj.prototype.toJSON = function() { throw new Error("toJSON had some error"); }
    TestObj.prototype.toString = function() { throw new Error(); }

    assert.equal(safeStringify(new TestObj()), "Stringify failed: 'toJSON had some error' Object: (toString failed on object)");
  })
});
