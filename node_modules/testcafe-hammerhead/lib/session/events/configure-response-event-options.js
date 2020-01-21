"use strict";

exports.__esModule = true;
exports.default = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class ConfigureResponseEventOptions {
  constructor(includeHeaders = false, includeBody = false) {
    _defineProperty(this, "includeHeaders", void 0);

    _defineProperty(this, "includeBody", void 0);

    this.includeHeaders = includeHeaders;
    this.includeBody = includeBody;
  }

  static get DEFAULT() {
    return new ConfigureResponseEventOptions();
  }

}

exports.default = ConfigureResponseEventOptions;
module.exports = exports.default;