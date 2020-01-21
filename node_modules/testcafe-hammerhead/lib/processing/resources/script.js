"use strict";

exports.__esModule = true;
exports.default = void 0;

var _resourceProcessorBase = _interopRequireDefault(require("./resource-processor-base"));

var _lruCache = _interopRequireDefault(require("lru-cache"));

var _script = require("../script");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class ScriptResourceProcessor extends _resourceProcessorBase.default {
  constructor() {
    super();

    _defineProperty(this, "jsCache", void 0);

    this.jsCache = new _lruCache.default({
      // NOTE: Max cache size is 50 MBytes.
      max: 50 * 1024 * 1024,
      length: function (n) {
        // NOTE: 1 char ~ 1 byte.
        return n.length;
      }
    });
  }

  processResource(script, _ctx, _charset, urlReplacer) {
    if (!script) return script;
    let processedScript = this.jsCache.get(script);

    if (!processedScript) {
      processedScript = (0, _script.processScript)(script, true, false, urlReplacer);
      this.jsCache.set(script, processedScript);
    }

    return processedScript;
  }

  shouldProcessResource(ctx) {
    return ctx.contentInfo.isScript;
  }

}

var _default = new ScriptResourceProcessor();

exports.default = _default;
module.exports = exports.default;