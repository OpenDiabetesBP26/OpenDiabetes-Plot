"use strict";

exports.__esModule = true;
exports.default = createSpecialPageResponse;

var _incomingMessageMock = _interopRequireDefault(require("./incoming-message-mock"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createSpecialPageResponse() {
  return new _incomingMessageMock.default({
    _body: Buffer.alloc(0),
    statusCode: 200,
    trailers: {},
    headers: {
      'content-type': 'text/html',
      'content-length': '0'
    }
  });
}

module.exports = exports.default;