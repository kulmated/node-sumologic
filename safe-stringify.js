/**
 * A safe version of stringify which handles circular refs
 */
module.exports = function safeStringify(val) {
  var visitedObjs = [];
  try {
    return JSON.stringify(val, handleCircularRef);
  } catch (e) {
    var errmsg = e.message || safeToString(e)

    if (e.filename) { errmsg += ' filename: ' + e.fileName }
    if (e.lineNumber) { errmsg += ' lineNumber: ' + e.lineNumber }

    return "Stringify failed: '" + errmsg + "' Object: " + safeToString(val);
  }

  function handleCircularRef(key, value) {
    if (visitedObjs.indexOf(value) !== -1) {
      return '<circular>';
    } else {
      if (typeof(value) === 'object') {
        visitedObjs.push(value);
      }
      return value;
    }
  }
}

function safeToString(obj) {
  try {
    return String(obj);
  } catch (e) {
    return "(toString failed on object)"
  }
}
